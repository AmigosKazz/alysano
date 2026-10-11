"use client";

import { useActionState, useEffect, useRef } from "react";
import { CtaButton } from "@/components/ui/Cta";
import { FIELDS, cue } from "@/components/contact/fields";
import { requestRates, type RequestState } from "@/lib/rates/actions";

/** Who is asking and where to answer. The phone is left to the contact page. */
const ASKED = FIELDS.filter((field) => ["name", "email", "company"].includes(field.name));

/**
 * The request for a service's rates. It posts to a Server Action: Aly is
 * written to, and once that has gone the page re-renders around the cookie the
 * action set — this form is replaced by the waiting line, so there is no
 * "sent" state to keep here, only a refusal to show.
 */
export function RatesRequestForm({ slug }: { slug: string }) {
  const [state, action, pending] = useActionState<RequestState, FormData>(requestRates, {});
  const shownAt = useRef(0);

  // Read in the submit, not at render: a timestamp in the markup would differ
  // between the server's pass and the browser's.
  useEffect(() => {
    shownAt.current = Date.now();
  }, []);

  return (
    <form
      className="form rates-form"
      action={(data) => {
        data.set("startedAt", String(shownAt.current));
        action(data);
      }}
    >
      <input type="hidden" name="slug" value={slug} />

      {/* The honeypot: out of sight and out of the tab order, so only a script
          that fills every box ever reaches it. */}
      <p className="rates-form-trap" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="form-grid">
        {ASKED.map((field) => (
          <p key={field.name} className="field">
            <label className="sr-only" htmlFor={`rates-${field.name}`}>
              {field.label}
            </label>
            <input
              id={`rates-${field.name}`}
              name={field.name}
              type={field.type ?? "text"}
              placeholder={cue(field)}
              required={field.required}
              autoComplete={field.autoComplete}
              defaultValue={state.values?.[field.name as "name" | "email" | "company"]}
              className="field-input"
            />
          </p>
        ))}

        <p className="field field-wide">
          <label className="sr-only" htmlFor="rates-message">
            What you are making
          </label>
          <textarea
            id="rates-message"
            name="message"
            rows={3}
            placeholder="What are you making, and when does it need to be finished?"
            defaultValue={state.values?.message}
            className="field-input field-area"
          />
        </p>
      </div>

      <p className="form-consent">
        <input id="rates-consent" name="consent" type="checkbox" required className="field-check" />
        <label htmlFor="rates-consent">I agree to be contacted about this request.</label>
      </p>

      <div className="form-action">
        <CtaButton type="submit" label="Ask for the rates" className="cta--block" disabled={pending} />
        <span role="status" className="form-status font-mono">
          {pending ? "Sending…" : (state.error ?? "")}
        </span>
      </div>
    </form>
  );
}
