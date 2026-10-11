/**
 * The fields the site's two forms have in common, so a name is asked for the
 * same way on the contact page and on a rate request.
 */
export type Field = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
};

/** Two to a row: who it is and where to answer, then how else to reach them. */
export const FIELDS: Field[] = [
  { name: "name", label: "Name", required: true, autoComplete: "name" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { name: "company", label: "Company", autoComplete: "organization" },
];

/** The bracket the rest of the page puts around a piece of metadata. */
export const cue = (field: Field) => `[  ${field.label}${field.required ? "*" : ""}  ]`;
