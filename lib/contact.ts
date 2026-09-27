/**
 * The one place the real details live. The contact page reads all of it from here,
 * and the form composes its message to `email` — swap these and everything follows.
 *
 * TODO: `email` is a placeholder until Aly gives the real address; `phone` and the
 * social `href`s are left empty on purpose and simply do not render until filled.
 */
export const CONTACT = {
  place: "Madagascar",
  email: "hello@alysanoo.com",
  phone: "",
  social: [
    { label: "Instagram", href: "" },
    { label: "Vimeo", href: "" },
    { label: "YouTube", href: "" },
  ],
} as const;
