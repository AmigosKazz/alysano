import { CATEGORIES } from "@/lib/services";
import { ServicesCta } from "./ServicesCta";

/**
 * Four lines on a black stage. Nothing here is driven by the scroll — no pin,
 * no scrub, no stage held against the window: the section is read by scrolling
 * past it the way the rest of the page is, and the rack focus on each line runs
 * on the browser's own view timeline.
 *
 * The four names and their lines come from `lib/services`, the same list the
 * rate cards are built from, so a discipline is named once.
 */
export function Services() {
  return (
    <section id="services" className="services">
      <div className="services-inner">
        <div className="services-head">
          <p className="services-kicker font-title">Across the whole chain</p>
          <p className="services-lede">
            Development, shoot and finish taken as one continuous piece of work
            rather than four handovers.
          </p>
        </div>

        <ul className="services-list">
          {CATEGORIES.map((service, i) => (
            <li key={service.slug} data-service data-index={i} className="service">
              <span className="service-line">
                <span className="service-index font-mono" aria-hidden="true">
                  [{String(i + 1).padStart(2, "0")}]
                </span>

                <h3 className="service-name font-title">
                  <a href={`/services/${service.slug}`} className="service-link">
                    {service.name}
                  </a>
                </h3>

                <span className="service-detail font-mono">{service.line}</span>
              </span>
            </li>
          ))}
        </ul>

        <p className="services-statement">
          The same hand carries it from the first decision to the master — no film
          handed along in parts.
        </p>
      </div>

      <ServicesCta items={CATEGORIES.map(({ slug, name }) => ({ slug, name }))} />
    </section>
  );
}
