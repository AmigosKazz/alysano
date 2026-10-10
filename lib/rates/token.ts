import "server-only";

import { SignJWT, errors, jwtVerify, type JWTPayload } from "jose";

/**
 * The three signed tokens the rate flow passes around. Each is a JWT (HS256)
 * with an audience of its own, so one can never be presented as another:
 *
 * - `approve` — goes to Aly with a request; confirming it grants access. Signed
 *   with the admin secret, which never signs anything a visitor holds, so a
 *   visitor cannot forge one from a token they were given.
 * - `access` — carried by the magic link, then by the cookie. It is what shows
 *   the rates.
 * - `pending` — a cookie set when a request is sent, so the same browser can be
 *   told it is being looked at. It grants nothing.
 *
 * Nothing is stored. A token carries everything it needs and its signature is
 * what makes it true — which is also its limit: one cannot be withdrawn on its
 * own. `RATES_MIN_IAT` voids everything signed before a given moment, and
 * rotating a secret voids everything it ever signed.
 */

/** The services an access covers: all of them, or the named few. */
export type Scope = "all" | readonly string[];

type ClaimsByKind = {
  /** The request, and what confirming it would grant. `from` is the service
   *  page it was sent from — where the magic link lands. */
  approve: { email: string; name: string; company?: string; from: string; scope: Scope };
  access: { email: string; from: string; scope: Scope };
  /** Every service this browser has asked about and not heard back on, with
   *  when it asked (seconds since the epoch). */
  pending: { email: string; asked: Readonly<Record<string, number>> };
};

export type TokenKind = keyof ClaimsByKind;
export type Claims<K extends TokenKind> = ClaimsByKind[K];

const DAY = 24 * 60 * 60;

const KINDS = {
  approve: { secret: "RATES_ADMIN_SECRET", lifetime: 14 * DAY },
  access: { secret: "RATES_ACCESS_SECRET", lifetime: 30 * DAY },
  pending: { secret: "RATES_ACCESS_SECRET", lifetime: 14 * DAY },
} as const;

/** In seconds — the cookies are given the same life as the token they hold. */
export const lifetime = (kind: TokenKind) => KINDS[kind].lifetime;

const ISSUER = "alysanoo";
const audience = (kind: TokenKind) => `rates:${kind}`;

/**
 * Read at call time, never at import: a missing secret fails the request that
 * needs it — loudly — rather than the build.
 */
function secret(name: (typeof KINDS)[TokenKind]["secret"]) {
  const value = process.env[name];
  if (!value || value.length < 32) {
    throw new Error(`${name} is missing or shorter than 32 characters — see .env.example`);
  }
  return new TextEncoder().encode(value);
}

/** The revoke-all switch, in seconds. Anything signed before it is void. */
function voidBefore(): number | null {
  const raw = process.env.RATES_MIN_IAT;
  if (!raw) return null;
  const at = Date.parse(raw);
  if (Number.isNaN(at)) throw new Error("RATES_MIN_IAT is not a date — see .env.example");
  return at / 1000;
}

/** `expiresAt` replaces the kind's lifetime — for a token re-signed to carry
 *  more, which should not outlive what it was made from. */
export async function signToken<K extends TokenKind>(
  kind: K,
  claims: Claims<K>,
  { expiresAt }: { expiresAt?: Date } = {},
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  return new SignJWT({ ...claims })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ISSUER)
    .setAudience(audience(kind))
    .setJti(crypto.randomUUID())
    .setIssuedAt(now)
    .setExpirationTime(expiresAt ? Math.floor(expiresAt.getTime() / 1000) : now + KINDS[kind].lifetime)
    .sign(secret(KINDS[kind].secret));
}

export type Verified<K extends TokenKind> =
  | { ok: true; claims: Claims<K>; id: string; issuedAt: Date; expiresAt: Date }
  /** A revoked token reads as `expired`: to the visitor, their access ended. */
  | { ok: false; reason: "expired" | "invalid" };

export async function verifyToken<K extends TokenKind>(kind: K, token: string): Promise<Verified<K>> {
  // Outside the try: a missing secret is a broken deployment, not a bad token.
  const key = secret(KINDS[kind].secret);
  const floor = voidBefore();

  let payload: JWTPayload;
  try {
    ({ payload } = await jwtVerify(token, key, {
      issuer: ISSUER,
      audience: audience(kind),
      algorithms: ["HS256"],
      requiredClaims: ["jti", "iat", "exp"],
    }));
  } catch (error) {
    return { ok: false, reason: error instanceof errors.JWTExpired ? "expired" : "invalid" };
  }

  const { jti, iat, exp } = payload as Required<Pick<JWTPayload, "jti" | "iat" | "exp">>;
  if (floor !== null && iat < floor) return { ok: false, reason: "expired" };

  // The signature proves who wrote it, not that it has the right shape.
  const claims = PARSE[kind](payload);
  if (!claims) return { ok: false, reason: "invalid" };

  return {
    ok: true,
    claims,
    id: jti,
    issuedAt: new Date(iat * 1000),
    expiresAt: new Date(exp * 1000),
  };
}

/* ------------------------------------------------------------------ */
/* Shapes                                                              */
/* ------------------------------------------------------------------ */

const isText = (value: unknown): value is string => typeof value === "string" && value.length > 0;

const isSlugs = (value: unknown): value is string[] => Array.isArray(value) && value.every(isText);

const isScope = (value: unknown): value is Scope => value === "all" || isSlugs(value);

const isAsked = (value: unknown): value is Record<string, number> =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  Object.entries(value).every(([slug, at]) => slug.length > 0 && Number.isInteger(at));

const PARSE: { [K in TokenKind]: (payload: JWTPayload) => Claims<K> | null } = {
  approve: ({ email, name, company, from, scope }) =>
    isText(email) && isText(name) && isText(from) && isScope(scope) &&
    (company === undefined || typeof company === "string")
      ? { email, name, company, from, scope }
      : null,

  access: ({ email, from, scope }) =>
    isText(email) && isText(from) && isScope(scope) ? { email, from, scope } : null,

  pending: ({ email, asked }) => (isText(email) && isAsked(asked) ? { email, asked } : null),
};
