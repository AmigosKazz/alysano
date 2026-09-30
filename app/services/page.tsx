import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services & rates — Aly Sanoo",
  description:
    "Directing, post-production, production design and full visual production — what each covers and what it costs, in ariary.",
};

/** The four disciplines, listed the way the home section stands them up. */
export default function ServicesIndexPage() {
  return (
    <main>
      <div className="page-cover">
        <section className="services-index">
          <header className="service-page-head">
            <h1 className="service-page-title font-title">Services</h1>
            <p className="service-page-intro">
              Four disciplines, one chain. Each carries its own rate card in ariary;
              every rate is a starting point, and the quote follows the brief.
            </p>
          </header>

          <ul className="services-index-list">
            {CATEGORIES.map((category, i) => (
              <li key={category.slug}>
                <Link href={`/services/${category.slug}`} className="services-index-link">
                  <span className="services-index-num font-mono" aria-hidden="true">
                    [{String(i + 1).padStart(2, "0")}]
                  </span>
                  <span className="services-index-name font-title">{category.name}</span>
                  <span className="services-index-line font-mono">{category.line}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
