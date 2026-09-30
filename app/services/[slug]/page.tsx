import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PriceTable } from "@/components/services/PriceTable";
import { Cta } from "@/components/ui/Cta";
import {
  CATALOGUES,
  CATEGORIES,
  CONDITIONS,
  ON_REQUEST,
  PACKS,
  PRODUCTION_DESIGN,
  PROJECT_STUDY,
  TIER_SCOPE,
  categoryBySlug,
  formatDiscount,
} from "@/lib/services";

export const generateStaticParams = () => CATEGORIES.map(({ slug }) => ({ slug }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryBySlug(slug);
  if (!category) return {};

  return {
    title: `${category.name} — rates — Aly Sanoo`,
    description: category.intro,
  };
}

/**
 * One discipline, read the way the home section reads it: the name at full
 * size on black, then what it covers, then the rates. The rail on the left is
 * desktop only — with seven tables on Directing, the eye needs an index.
 */
export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categoryBySlug(slug);
  if (!category) notFound();

  const catalogues = category.catalogueIds.map((id) => CATALOGUES[id]);
  const packs = category.packIds.map((id) => PACKS[id]);
  const isDesign = slug === "production-design";

  return (
    <main>
      <div className="page-cover">
        <article className="service-page">
          <header className="service-page-head">
            <p className="service-page-back font-mono">
              <Link href="/services">Services</Link>
            </p>
            <h1 className="service-page-title font-title">{category.name}</h1>
            <p className="service-page-intro">{category.intro}</p>
          </header>

          <div className="service-page-body">
            {/* The index. Sticky on desktop, gone on a phone — the anchors are
                still there for anyone who lands on one. */}
            {catalogues.length > 1 ? (
              <nav className="service-rail" aria-label="Rate cards">
                <ol className="font-mono">
                  {catalogues.map((catalogue, i) => (
                    <li key={catalogue.id}>
                      <a href={`#${catalogue.id}`}>
                        <span aria-hidden="true">[{String(i + 1).padStart(2, "0")}]</span>
                        {catalogue.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            ) : null}

            <div className="service-page-main">
              {/* What the number covers, before any number. */}
              <section className="service-scope" aria-label="Scope">
                <div>
                  <h2 className="service-scope-label font-mono">Included</h2>
                  <ul>
                    {category.scope.included.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="service-scope-label font-mono">Not included</h2>
                  <ul className="service-scope-out">
                    {category.scope.excluded.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </section>

              {catalogues.map((catalogue) => (
                <PriceTable key={catalogue.id} catalogue={catalogue} />
              ))}

              {/* Production design carries no rate card: it is built per
                  project, so the page shows what it is made of instead. */}
              {isDesign ? (
                <section className="service-block" aria-label="Production design">
                  <h2 className="service-block-title font-title">What moves the budget</h2>
                  <ul className="service-factors">
                    {PRODUCTION_DESIGN.factors.map((factor) => (
                      <li key={factor.label}>
                        <span className="font-mono">{factor.label}</span>
                        {factor.detail}
                      </li>
                    ))}
                  </ul>

                  <h2 className="service-block-title font-title">In front of the lens</h2>
                  <table className="rates-table rates-table--plain">
                    <caption className="sr-only">
                      Production elements and who carries them
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">Element</th>
                        <th scope="col" className="font-mono">
                          Carried by
                        </th>
                        <th scope="col" className="font-mono">
                          Note
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {PRODUCTION_DESIGN.externals.map((item) => (
                        <tr key={item.label}>
                          <th scope="row">{item.label}</th>
                          <td className="font-mono">{item.handling}</td>
                          <td className="font-mono">{item.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <ul className="service-notes">
                    {PRODUCTION_DESIGN.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {/* What each tier means, where tiers are on offer. */}
              {catalogues.length ? (
                <section className="service-block" aria-label="Tiers">
                  <h2 className="service-block-title font-title">What a tier covers</h2>
                  <ul className="service-tiers">
                    {TIER_SCOPE.map((entry) => (
                      <li key={entry.tier}>
                        <span className="font-mono">{entry.tier}</span>
                        {entry.detail}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {category.showOnRequest ? (
                <section className="service-block" aria-label="On request">
                  <h2 className="service-block-title font-title">On request</h2>
                  <p className="service-block-line">
                    Quoted per project rather than off a list.
                  </p>
                  <ul className="service-list font-mono">
                    {ON_REQUEST.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {packs.length ? (
                <section className="service-block" aria-label="Volume">
                  <h2 className="service-block-title font-title">If there is more than one</h2>
                  <p className="service-block-line">
                    Discounts apply to a confirmed volume, taken off the listed rate.
                  </p>
                  <div className="service-packs">
                    {packs.map((pack) => (
                      <div key={pack.id} className="service-pack">
                        <h3 className="service-pack-title font-mono">{pack.title}</h3>
                        <ul>
                          {pack.steps.map((step) => (
                            <li key={step.label}>
                              <span>{step.label}</span>
                              <span className="font-mono">{formatDiscount(step.discount)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {/* The path to a number, and the one paid step on it. */}
              <section className="service-block" aria-label="How a quote is built">
                <h2 className="service-block-title font-title">How a quote is built</h2>
                <ol className="service-steps">
                  {PROJECT_STUDY.steps.map((step, i) => (
                    <li key={step.label}>
                      <span className="service-step-index font-mono" aria-hidden="true">
                        [{String(i + 1).padStart(2, "0")}]
                      </span>
                      <span className="service-step-label">{step.label}</span>
                      <span className="service-step-detail">{step.detail}</span>
                      <span className="service-step-fee font-mono">{step.fee}</span>
                    </li>
                  ))}
                </ol>
                <p className="service-block-line">{PROJECT_STUDY.line}</p>
              </section>

              <div className="service-action">
                <Cta href={`/contact?service=${category.slug}`} label="Request a quote" />
              </div>

              <section className="service-terms" aria-label="Terms">
                <details>
                  <summary className="font-mono">Terms — the same fifteen for every project</summary>
                  <ol className="service-conditions">
                    {CONDITIONS.map((condition, i) => (
                      <li key={condition.label}>
                        <span className="font-mono">{String(i + 1).padStart(2, "0")}</span>
                        <span className="service-condition-label">{condition.label}</span>
                        <span className="service-condition-detail">{condition.detail}</span>
                      </li>
                    ))}
                  </ol>
                </details>
              </section>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
