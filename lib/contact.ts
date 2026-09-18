/**
 * The one place the real details live. The contact page reads all of it from here,
 * and the form composes its message to `email` — swap these and everything follows.
 *
 * TODO: `email` is a placeholder until Aly gives the real address; `phone` is left
 * empty on purpose and simply does not render.
 */
export const CONTACT = {
  place: "Madagascar",
  email: "hello@alysanoo.com",
  phone: "",
} as const;
