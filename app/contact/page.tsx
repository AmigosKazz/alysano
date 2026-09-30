import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/contact/ContactForm";
import { CONTACT, telHref } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact — Aly Sanoo",
  description:
    "Start a project with Aly Sanoo. Editing, post-production and sound design for film, music and commercial work.",
};

/**
 * The invitation, set as a brief: what the work is and how to reach him on the
 * left, the form itself out on the right margin. The band of black between the
 * two columns is the point — the page asks for one thing at a time.
 */
export default function ContactPage() {
  return (
    <main>
      <div className="page-cover">
        <section className="contact-page">
          <div className="contact-lede">
            <h1 className="contact-title font-title">Start a project</h1>

            <p className="contact-intro">
              Directors, labels, agencies and brands — from a single cut to a full
              post-production pass. Say what you are making, where it is now, and
              when it has to be finished.
            </p>

            <div className="contact-block">
              <p className="contact-label font-title">Prefer to reach out directly?</p>
              <a className="contact-reach" href={`mailto:${CONTACT.email}`}>
                {CONTACT.email}
              </a>
              {CONTACT.phone ? (
                <a className="contact-reach" href={telHref(CONTACT.phone)}>
                  {CONTACT.phone}
                </a>
              ) : null}
              <p className="contact-reach contact-reach--muted">{CONTACT.place}</p>
            </div>

            <div className="contact-block">
              <p className="contact-label font-title">Social:</p>
              <ul className="contact-social">
                {CONTACT.social.map((link) => (
                  <li key={link.label}>
                    {/* Set as plain type until its profile URL lands in
                        lib/contact.ts — a control that goes nowhere is worse
                        than one that is not a link yet. */}
                    {link.href ? (
                      <a
                        className="contact-social-link font-mono"
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <span className="contact-social-link contact-social-link--idle font-mono">
                        {link.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* The form reads `?service=` to open the message with the rate card
              the visitor came from, and `useSearchParams` needs a boundary or
              the whole page drops out of static rendering. */}
          <Suspense fallback={<div className="form" />}>
            <ContactForm />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
