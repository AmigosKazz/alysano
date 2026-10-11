import "server-only";

import nodemailer, { type Transporter } from "nodemailer";

/**
 * The one way out for email. A message is a plain-text note — nothing in it is
 * markup, so nothing a visitor typed can become any.
 *
 * Sent over SMTP (Gmail today, any provider by changing the `MAIL_*` values).
 * With no `MAIL_HOST` set the message is printed to the server log instead — in
 * development only. In production a missing server is an error, never a silent
 * success: a visitor must not be told their request was sent when it was not.
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

/** One connection setup per server instance, built on first use. */
let transport: Transporter | null = null;

function smtp() {
  if (transport) return transport;
  const port = Number(env("MAIL_PORT"));
  transport = nodemailer.createTransport({
    host: env("MAIL_HOST"),
    port,
    // 465 speaks TLS from the first byte; 587 starts plain and upgrades.
    secure: port === 465,
    auth: { user: env("MAIL_USERNAME"), pass: env("MAIL_PASSWORD") },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
  return transport;
}

export async function sendMail({ to, subject, text, replyTo }: Mail) {
  if (!process.env.MAIL_HOST) {
    if (process.env.NODE_ENV === "production") throw new Error("MAIL_HOST is not set");
    console.log(`\n[mail · not sent, no MAIL_HOST]\nTo: ${to}\nSubject: ${subject}\n\n${text}\n`);
    return;
  }

  await smtp().sendMail({
    // Gmail only sends as the account it is signed in with (or its aliases).
    from: { name: process.env.MAIL_FROM_NAME ?? "", address: env("MAIL_FROM") },
    to,
    subject,
    text,
    ...(replyTo ? { replyTo } : {}),
  });
}

/** Where requests are sent. */
export const notifyTo = () => env("RATES_NOTIFY_TO");
