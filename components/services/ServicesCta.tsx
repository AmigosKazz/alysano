"use client";

import { useEffect, useState } from "react";
import { FramedCta } from "@/components/ui/FramedCta";

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
 *
 * The control itself is the header's — same frame, same roll, same steel
 * square — so the page only ever teaches one call to action.
 */
export function ServicesCta({ items }: { items: Item[] }) {
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
      className="services-cta"
      data-shown={item ? "true" : "false"}
      // Off the a11y tree and out of the tab order while it is not on screen:
      // every discipline is still reachable from its own name in the list.
      inert={!item}
    >
      {/* The name changes, the control does not — so the frame never resizes
          under the pointer as the stack moves. */}
      <p className="services-cta-name font-mono" aria-hidden="true">
        {item?.name ?? ""}
      </p>

      {items.map((entry, i) => (
        <FramedCta
          key={entry.slug}
          href={`/services/${entry.slug}`}
          label="See rates"
          ariaLabel={`See ${entry.name} rates`}
          wide
          className="services-cta-link"
          data-current={i === active ? "true" : "false"}
          tabIndex={i === active ? undefined : -1}
        />
      ))}
    </div>
  );
}
