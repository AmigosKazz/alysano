import "server-only";

import { cookies } from "next/headers";
import { lifetime, signToken, verifyToken, type Scope, type TokenKind } from "./token";

/**
 * Where a visitor stands with the rates, read from their cookies alone — and
 * the only code that writes those cookies.
 *
 * Reading works anywhere on the server. Writing only works in a Server Action
 * or a Route Handler: a cookie travels in the response headers, which are gone
 * by the time a page is rendering.
 */

const secure = process.env.NODE_ENV === "production";

/** `__Host-` pins a cookie to this exact host, over HTTPS only — so it is used
 *  only where there is HTTPS. On localhost the plain name stands in. */
const named = (name: string) => (secure ? `__Host-${name}` : name);

const ACCESS_COOKIE = named("aly_rates");
const PENDING_COOKIE = named("aly_rates_pending");

/** Out of reach of page scripts, sent back on a link followed from an email. */
const COOKIE = { httpOnly: true, secure, sameSite: "lax", path: "/" } as const;

export type RatesAccess =
  | { state: "granted"; email: string; scope: Scope; until: Date }
  | { state: "pending"; email: string; since: Date }
  /** There was an access, and it has run out or been revoked. */
  | { state: "expired" }
  | { state: "none" };

export const covers = (scope: Scope, slug: string) => scope === "all" || scope.includes(slug);

const widen = (a: Scope, b: Scope): Scope =>
  a === "all" || b === "all" ? "all" : [...new Set([...a, ...b])];

/** The token a cookie holds, checked — or null when there is no cookie. */
async function held<K extends TokenKind>(kind: K, cookie: string) {
  const value = (await cookies()).get(cookie)?.value;
  return value ? verifyToken(kind, value) : null;
}

export async function getRatesAccess(slug: string): Promise<RatesAccess> {
  const access = await held("access", ACCESS_COOKIE);
  if (access?.ok && covers(access.claims.scope, slug)) {
    return { state: "granted", email: access.claims.email, scope: access.claims.scope, until: access.expiresAt };
  }

  // Checked after the access, not before: a newer request for this service
  // outranks an access that has run out, or one that covers other services.
  const pending = await held("pending", PENDING_COOKIE);
  const asked = pending?.ok ? pending.claims.asked[slug] : undefined;
  if (pending?.ok && asked) {
    return { state: "pending", email: pending.claims.email, since: new Date(asked * 1000) };
  }

  return access && !access.ok ? { state: "expired" } : { state: "none" };
}

/**
 * The magic link's half: a valid access token becomes the cookie.
 *
 * An access already held by the same person is added to rather than replaced,
 * so a second approval never takes back the first — and the latest approval
 * sets how long the whole of it lasts. Only the requests it answers are
 * settled; any others stay pending.
 */
export async function redeemAccess(token: string) {
  const incoming = await verifyToken("access", token);
  if (!incoming.ok) return incoming;

  const jar = await cookies();
  const { email, from } = incoming.claims;

  let scope = incoming.claims.scope;
  let until = incoming.expiresAt;
  let value = token;

  const current = await held("access", ACCESS_COOKIE);
  if (current?.ok && current.claims.email === email) {
    scope = widen(current.claims.scope, scope);
    until = new Date(Math.max(current.expiresAt.getTime(), until.getTime()));
    value = await signToken("access", { email, from, scope }, { expiresAt: until });
  }

  jar.set(ACCESS_COOKIE, value, { ...COOKIE, expires: until });

  const pending = await held("pending", PENDING_COOKIE);
  const open = pending?.ok
    ? Object.entries(pending.claims.asked).filter(([slug]) => !covers(scope, slug))
    : [];

  if (pending?.ok && open.length) {
    const asked = Object.fromEntries(open);
    jar.set(PENDING_COOKIE, await signToken(
      "pending",
      { email: pending.claims.email, asked },
      { expiresAt: pending.expiresAt },
    ), {
      ...COOKIE,
      expires: pending.expiresAt,
    });
  } else if (pending) {
    // Set rather than deleted: a `__Host-` cookie is only cleared by a header
    // carrying the same attributes it was set with.
    jar.set(PENDING_COOKIE, "", { ...COOKIE, maxAge: 0 });
  }

  return { ok: true as const, email, from, scope, until };
}

/**
 * The request's half. The browser remembers what it asked for and when —
 * added to what it asked before, as long as it is the same person asking.
 */
export async function markPending(email: string, slug: string) {
  const previous = await held("pending", PENDING_COOKIE);
  const asked = {
    ...(previous?.ok && previous.claims.email === email ? previous.claims.asked : {}),
    [slug]: Math.floor(Date.now() / 1000),
  };

  (await cookies()).set(PENDING_COOKIE, await signToken("pending", { email, asked }), {
    ...COOKIE,
    maxAge: lifetime("pending"),
  });
}
