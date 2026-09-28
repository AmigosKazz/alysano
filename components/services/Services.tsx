type Service = { name: string; detail: string };

const SERVICES: Service[] = [
  {
    name: "Directing",
    detail: "Treatment. Shot design. Casting eye. On-set direction. Performance and blocking.",
  },
  {
    name: "Post-production",
    detail: "Edit. Structure. Rhythm and pacing. Colour. Sound design. Mix. Master and delivery.",
  },
  {
    name: "Production Design",
    detail: "Set design. Props. Styling. Surface and texture. Lighting mood. Location dressing.",
  },
  {
    name: "Full Visual Production",
    detail: "Brief. Treatment. Shoot. Finish. One continuous pass from first decision to master.",
  },
];

/**
 * Four lines on a black stage. Nothing here is driven by the scroll — no pin,
 * no scrub, no stage held against the window: the section is read by scrolling
 * past it the way the rest of the page is. All four lines stand at full size
 * and in focus, and the page never stops moving over them.
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
          {SERVICES.map((service, i) => (
            <li key={service.name} className="service">
              <span className="service-line">
                <span className="service-index font-mono" aria-hidden="true">
                  [{String(i + 1).padStart(2, "0")}]
                </span>

                <h3 className="service-name font-title">{service.name}</h3>

                <span className="service-detail font-mono">{service.detail}</span>
              </span>
            </li>
          ))}
        </ul>

        <p className="services-statement">
          The same hand carries it from the first decision to the master — no film
          handed along in parts.
        </p>
      </div>
    </section>
  );
}
