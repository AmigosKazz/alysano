import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { CONTACT } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact — Aly Sanoo",
  description:
    "Start a project with Aly Sanoo. Editing, post-production and sound design for film, music and commercial work.",
};

/**
 * The page the invitation leads to. The word fills the top edge to edge, the form
 * sits under its left half, and the details hold the right margin — the same
 * asymmetry the rest of the site is built on.
 */
export default function ContactPage() {
  return (
    <main>
      <div className="page-cover">
        <section className="contact-page">
          <h1 className="contact-page-title font-title">Contact</h1>

          <div className="contact-page-body">
            <ContactForm />

            <aside className="contact-page-info">
              <div className="info-block">
                <p className="info-label font-mono">Based in</p>
                <p className="info-value">{CONTACT.place}</p>
              </div>

              {CONTACT.phone ? (
                <div className="info-block">
                  <p className="info-label font-mono">Phone</p>
                  <a className="info-value info-link" href={`tel:${CONTACT.phone}`}>
                    {CONTACT.phone}
                  </a>
                </div>
              ) : null}

              <div className="info-block">
                <p className="info-label font-mono">Email</p>
                <a className="info-value info-link" href={`mailto:${CONTACT.email}`}>
                  {CONTACT.email}
                </a>
              </div>

              <div className="info-block">
                <p className="info-label font-mono">Available</p>
                <p className="info-value">For select projects, 2026</p>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
