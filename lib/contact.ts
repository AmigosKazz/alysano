/**
 * The one place the real details live. The contact page reads all of it from here,
 * and the form composes its message to `email` — swap these and everything follows.
 *
 * TODO: `email` is a placeholder until Aly gives the real address, and the social
 * `href`s are still empty — each one renders as plain type until its profile URL
 * lands here, so the page never carries a link that goes nowhere.
 */
export const CONTACT = {
  place: "Madagascar",
  email: "hello@alysanoo.com",
  phone: "+261 32 11 276 20",
  social: [
    { label: "LinkedIn", href: "" },
    { label: "Instagram", href: "" },
    { label: "Facebook", href: "" },
  ],
} as const;

/** `tel:` wants the digits and the country code, nothing else. */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
