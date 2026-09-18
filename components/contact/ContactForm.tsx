"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { CtaButton } from "@/components/ui/Cta";
import { CONTACT } from "@/lib/contact";

type Field = {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
};

/** Two to a row on desktop, in the order the reference reads them. */
const FIELDS: Field[] = [
  { name: "name", label: "Name", placeholder: "John", required: true, autoComplete: "given-name" },
  {
    name: "surname",
    label: "Surname",
    placeholder: "Doe",
    required: true,
    autoComplete: "family-name",
  },
  { name: "company", label: "Company", placeholder: "Studio", autoComplete: "organization" },
  { name: "role", label: "Job title", placeholder: "Producer", autoComplete: "organization-title" },
  {
    name: "email",
    label: "Email",
    placeholder: "john.doe@example.com",
    type: "email",
    required: true,
    autoComplete: "email",
  },
  { name: "phone", label: "Phone", placeholder: "+261 00 000 00", type: "tel", autoComplete: "tel" },
];

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

    const subject = `Project enquiry — ${value("name")} ${value("surname")}`.trim();
    const body = [
      `Name: ${value("name")} ${value("surname")}`,
      value("company") && `Company: ${value("company")}`,
      value("role") && `Job title: ${value("role")}`,
      `Email: ${value("email")}`,
      value("phone") && `Phone: ${value("phone")}`,
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
    <form ref={formRef} className="form" onSubmit={submit} noValidate={false}>
      <div className="form-grid">
        {FIELDS.map((field) => (
          <p key={field.name} data-row className="field">
            <label className="field-label" htmlFor={field.name}>
              {field.label}
              {field.required ? (
                <span className="field-mark" aria-hidden="true">
                  *
                </span>
              ) : null}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type ?? "text"}
              placeholder={field.placeholder}
              required={field.required}
              autoComplete={field.autoComplete}
              className="field-input"
            />
          </p>
        ))}

        <p data-row className="field field-wide">
          <label className="field-label" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            placeholder="What are we cutting?"
            className="field-input field-area"
          />
        </p>
      </div>

      <div data-row className="form-action">
        <CtaButton type="submit" label="Send" />
        <span role="status" className="form-status font-mono">
          {sent ? "Opening your mail app…" : ""}
        </span>
      </div>
    </form>
  );
}
