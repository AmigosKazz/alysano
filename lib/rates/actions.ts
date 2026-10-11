"use server";

import { CONTACT } from "@/lib/contact";
import { categoryBySlug } from "@/lib/services";
import { markPending } from "./access";
import { notifyTo, oneLine, sendMail, siteUrl } from "./mail";
import { lifetime, signToken, verifyToken } from "./token";

/**
 * Two actions close the loop. `requestRates` is the visitor's; `approveRates`
 * is Aly's, and is what turns a request into a link.
 *
 * A visitor asks for the rates. Aly is told by email, with two links — this
 * service, or all of them — and nothing is granted until one is confirmed.
 *
 * Nothing is stored: the request lives in that email, and in the signed tokens
 * the links carry. The browser is told it is waiting by a cookie, and Next
 * re-renders the page around it, so the form turns into the waiting line on
 * its own.
 */

export type RequestState = {
  error?: string;
  /** What was typed, handed back so a refused form is not an emptied one. */
  values?: Partial<Record<"name" | "email" | "company" | "message", string>>;
};

const LIMITS = { name: 120, email: 254, company: 160, message: 2000 } as const;

/** Faster than a person can read the form — a script, not a visitor. */
const TOO_QUICK_MS = 1500;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const text = (data: FormData, key: string) => {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : "";
};

export async function requestRates(_previous: RequestState, data: FormData): Promise<RequestState> {
  // A field no visitor can see. Anything in it is a script filling every box;
  // it is answered like a success and nothing is sent.
  if (text(data, "website")) return {};

  const values = {
    name: text(data, "name"),
    email: text(data, "email"),
    company: text(data, "company"),
    message: text(data, "message"),
  };
  const slug = text(data, "slug");
  const category = categoryBySlug(slug);

  const fail = (error: string): RequestState => ({ error, values });

  if (!category) return fail("This service could not be found. Reload the page and try again.");
  if (Date.now() - Number(text(data, "startedAt")) < TOO_QUICK_MS) {
    return fail("That was very quick — please try again.");
  }
  if (!values.name) return fail("Please say who is asking.");
  if (!EMAIL.test(values.email)) return fail("That email address does not look right.");
  if (data.get("consent") !== "on") return fail("Please agree to be contacted about this request.");
  for (const [key, max] of Object.entries(LIMITS)) {
    if (values[key as keyof typeof values].length > max) return fail("One of the fields is too long.");
  }

  const { email, name, company, message } = values;
  const link = async (scope: "all" | string[]) =>
    `${siteUrl()}/rates/approve?t=${await signToken("approve", {
      email,
      name,
      company: company || undefined,
      from: slug,
      scope,
    })}`;

  try {
    await sendMail({
      to: notifyTo(),
      replyTo: email,
      subject: oneLine(`Rates request — ${category.name} — ${name}`),
      text: [
        `${name} <${email}>${company ? ` · ${company}` : ""}`,
        `Asked for the rates of: ${category.name}`,
        message && `\n${message}`,
        `\n— Approve ${category.name} only:\n${await link([slug])}`,
        `\n— Approve every service:\n${await link("all")}`,
        "\nNothing is shared until you confirm on the page the link opens. To decline, do nothing: the links lapse in 14 days.",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  } catch (error) {
    console.error("[rates] request not sent", error);
    return fail(`The request could not be sent. Please write to ${CONTACT.email} instead.`);
  }

  // Only once it is on its way: the browser is never told it is waiting for a
  // reply to something that never left.
  await markPending(email, slug);
  return {};
}

/* ------------------------------------------------------------------ */
/* Approval                                                            */
/* ------------------------------------------------------------------ */

export type ApproveState = {
  error?: string;
  /** Set once the link has gone — what the page then reports. */
  sent?: { email: string };
};

/**
 * Aly confirms. The approval token is checked again here, not trusted from the
 * page that showed it, and what it grants is read from the token — never from
 * the form, which only carries the token back.
 *
 * Nothing records that a request was answered, so confirming twice sends two
 * links. Both work and both lapse; the cost of the second is an email.
 */
export async function approveRates(_previous: ApproveState, data: FormData): Promise<ApproveState> {
  const token = text(data, "t");
  const verified = token ? await verifyToken("approve", token) : null;
  if (!verified?.ok) return { error: "This approval link has lapsed or is not valid." };

  const { email, name, from, scope } = verified.claims;
  const covered =
    scope === "all"
      ? "every service"
      : scope.map((slug) => categoryBySlug(slug)?.name ?? slug).join(", ");

  try {
    const access = await signToken("access", { email, from, scope });
    const until = new Date(Date.now() + lifetime("access") * 1000);

    await sendMail({
      to: email,
      subject: "Your access to the rates — Aly Sanoo",
      text: [
        `Hello ${name},`,
        `Your request has been approved. This link opens the rates for ${covered}, in the browser you open it with, until ${until.toISOString().slice(0, 10)}:`,
        `${siteUrl()}/rates/access?t=${access}`,
        "Open it on the device you will read them on. If you did not ask for this, you can ignore this message.",
        "— Aly Sanoo",
      ].join("\n\n"),
    });
  } catch (error) {
    console.error("[rates] access link not sent", error);
    return { error: "The link could not be sent. Try again in a moment." };
  }

  return { sent: { email } };
}
