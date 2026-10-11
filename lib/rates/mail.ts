import "server-only";

/**
 * The one way out for email. A message is a plain-text note — nothing in it is
 * markup, so nothing a visitor typed can become any.
 *
 * Resend is called over its HTTP API; there is no SDK to carry. With no key set
 * the message is printed to the server log instead — in development only. In
 * production a missing key is an error, never a silent success: a visitor must
 * not be told their request was sent when it was not.
 */

export type Mail = {
  to: string;
  subject: string;
  text: string;
  /** Where a plain "reply" should go — the visitor, on a note sent to Aly. */
  replyTo?: string;
};

const env = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set — see .env.example`);
  return value;
};

/** Headers cannot carry a line break; a name pasted with one must not add one. */
export const oneLine = (text: string) => text.replace(/\s+/g, " ").trim();

/**
 * Where the links in an email point. Read from the environment and nowhere
 * else: the request's own `Host` header is the visitor's to choose, and a link
 * that goes to wherever they said would be a link Aly clicks on their word.
 */
export function siteUrl() {
  const url = process.env.SITE_URL;
  if (url) return url.replace(/\/+$/, "");
  if (process.env.NODE_ENV !== "production") return "http://localhost:5001";
  throw new Error("SITE_URL is not set — see .env.example");
}

export async function sendMail({ to, subject, text, replyTo }: Mail) {
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    if (process.env.NODE_ENV === "production") throw new Error("RESEND_API_KEY is not set");
    console.log(`\n[mail · not sent, no RESEND_API_KEY]\nTo: ${to}\nSubject: ${subject}\n\n${text}\n`);
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env("RATES_MAIL_FROM"),
      to,
      subject,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Resend answered ${response.status}: ${(await response.text()).slice(0, 300)}`);
  }
}

/** Where requests are sent. */
export const notifyTo = () => env("RATES_NOTIFY_TO");
