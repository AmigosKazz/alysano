"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Item = { slug: string; name: string };

/**
 * The way into the rate cards, and the only interactive thing on the stage.
 *
 * It answers the line being read: whichever discipline is crossing the middle
 * of the window is the one the button opens. One IntersectionObserver does both
 * jobs — it names the active line, and its absence is what hides the button, so
 * the control arrives with the first line and leaves with the last.
 *
 * No scroll listener and no scroll-driven animation: the observer watches, it
 * never takes the scroll.
 */
export function ServicesCta({ items }: { items: Item[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const rows = document.querySelectorAll<HTMLElement>("[data-service]");
    if (!rows.length) return;

    // A thin band across the middle of the window — the reading line the rack
    // focus already works to. A line inside it is the line in focus.
    const inBand = new Set<number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (entry.isIntersecting) inBand.add(index);
          else inBand.delete(index);
        }
        // The lowest index reads as the one being left behind last — with a
        // band this thin there is rarely more than one anyway.
        setActive(inBand.size ? Math.min(...inBand) : null);
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 },
    );

    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, []);

  const item = active === null ? null : items[active];

  return (
    <div
      ref={ref}
      className="services-cta"
      data-shown={item ? "true" : "false"}
      // Out of the tab order and off the a11y tree while it is not on screen:
      // the rate cards are reachable from the section's own links regardless.
      aria-hidden={item ? undefined : "true"}
      inert={!item}
    >
      {items.map((entry, i) => (
        <Link
          key={entry.slug}
          href={`/services/${entry.slug}`}
          className="services-cta-link cta cta--block font-mono"
          data-current={i === active ? "true" : "false"}
          tabIndex={i === active ? undefined : -1}
        >
          <span className="cta-label">
            See {entry.name} rates
          </span>
          <span className="cta-arrow" aria-hidden="true">
            <svg width="13" height="9" viewBox="0 0 13 9" fill="none">
              <path
                d="M0 4.5h11M8 1l3.5 3.5L8 8"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="square"
              />
            </svg>
          </span>
        </Link>
      ))}
    </div>
  );
}
