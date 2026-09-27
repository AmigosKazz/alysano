"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { CtaButton } from "@/components/ui/Cta";
import { CONTACT } from "@/lib/contact";

type Field = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
};

/** Two to a row: who it is and where to answer, then how else to reach them. */
const FIELDS: Field[] = [
  { name: "name", label: "Name", required: true, autoComplete: "name" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { name: "company", label: "Company", autoComplete: "organization" },
];

/** The bracket the rest of the page puts around a piece of metadata. */
const cue = (field: Field) => `[  ${field.label}${field.required ? "*" : ""}  ]`;

/**
 * No backend to speak to, so the form composes the message and hands it to the
 * visitor's own mail client — nothing is captured on the way, and the reply lands
 * in a real inbox. The browser does the validation, which is what it is for.
 */
export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [sent, setSent] = useState(false);

  useLayoutEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const mm = gsap.matchMedia(form);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        "[data-row]",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.07, ease: "power3.out", delay: 0.35 },
      );
    });

    return () => mm.revert();
  }, []);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();

    const subject = `Project enquiry — ${value("name")}`.trim();
    const body = [
      `Name: ${value("name")}`,
      `Email: ${value("email")}`,
      value("phone") && `Phone: ${value("phone")}`,
      value("company") && `Company: ${value("company")}`,
      "",
      value("message"),
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <form ref={formRef} className="form" onSubmit={submit}>
      <div className="form-grid">
        {FIELDS.map((field) => (
          <p key={field.name} data-row className="field">
            {/* The cue carries the label, so this one is for screen readers. */}
            <label className="sr-only" htmlFor={field.name}>
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type ?? "text"}
              placeholder={cue(field)}
              required={field.required}
              autoComplete={field.autoComplete}
              className="field-input"
            />
          </p>
        ))}

        <p data-row className="field field-wide">
          <label className="sr-only" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            placeholder="Message"
            className="field-input field-area"
          />
        </p>
      </div>

      <p data-row className="form-consent">
        <input id="consent" name="consent" type="checkbox" required className="field-check" />
        <label htmlFor="consent">I agree to be contacted about this enquiry.</label>
      </p>

      <div data-row className="form-action">
        <CtaButton type="submit" label="Send request" className="cta--block" />
        <span role="status" className="form-status font-mono">
          {sent ? "Opening your mail app…" : ""}
        </span>
      </div>
    </form>
  );
}
