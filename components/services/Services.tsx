"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

/** How far out of focus a line goes once it is no longer the one being read. */
const MAX_BLUR = 13;

/**
 * Four lines on a black stage, read one at a time. The stack rides the scroll:
 * whichever line reaches the reading height comes into focus and full size while
 * the others fall back, dim and out of focus — the rack focus a camera would do,
 * done to type. Nothing here is a card and nothing carries an icon.
 */
export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;
    if (!section || !list) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(section);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-service]", list);
      const last = rows.length - 1;

      // One setter per property per row: the scrub calls these on every frame,
      // and quickSetter skips the lookup and unit parsing each time.
      const set = rows.map((row) => ({
        y: gsap.quickSetter(row, "yPercent"),
        scale: gsap.quickSetter(row, "scale"),
        blur: gsap.quickSetter(row, "filter"),
        opacity: gsap.quickSetter(row, "opacity"),
      }));

      /** `head` is the line currently at the reading height, as a fraction. */
      const render = (head: number) => {
        rows.forEach((_, i) => {
          const d = i - head;
          const away = Math.abs(d);
          const near = Math.min(away, 1);

          // The whole stack slides so that `head` sits on the reading line.
          set[i].y(-head * 100);
          set[i].scale(gsap.utils.interpolate(1, 0.56, near));
          set[i].blur(`blur(${Math.min(away * 6, MAX_BLUR)}px)`);
          // Out of focus at one line away, and gone by three — otherwise the
          // far ends of the stack pile into the heading and the statement.
          set[i].opacity(
            gsap.utils.interpolate(1, 0.26, near) *
              gsap.utils.clamp(0, 1, 1 - (away - 1) / 2),
          );
        });
      };

      // Each line travels in the first part of its segment and then holds, so
      // there is something to read rather than a stack sliding continuously.
      const ease = gsap.parseEase("power2.inOut");
      const HOLD = 0.62;
      const headAt = (progress: number) => {
        const step = gsap.utils.clamp(0, last - 0.0001, progress * last);
        const from = Math.floor(step);
        return from + ease(Math.min((step - from) / (1 - HOLD), 1));
      };

      render(0);

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        // Short of the section's end on purpose: the stage stays held for a
        // while after the last line lands, so it is read rather than glimpsed
        // on its way out.
        end: "+=185%",
        // A long scrub: the stack eases in behind the scroll rather than
        // tracking it frame for frame, which is what makes it read as a rack
        // focus instead of a slider.
        scrub: 1.1,
        onUpdate: (self) => render(headAt(self.progress)),
      });

      return () => trigger.kill();
    });

    // The head of the section arrives the way every other one does.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({ scrollTrigger: { trigger: section, start: "top 70%" } })
        .fromTo(
          "[data-kicker]",
          { opacity: 0, x: -8 },
          { opacity: 1, x: 0, duration: 0.9, ease: "power2.out" },
          0,
        )
        .fromTo(
          "[data-fade]",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: "power3.out" },
          0.2,
        );
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="services" className="services">
      {/* Holds the window while the stack is read; the section around it is
          what supplies the scroll the reading takes. */}
      <div className="services-stage">
        <div className="services-head">
          <p data-kicker className="services-kicker font-title">
            Across the whole chain
          </p>
          <p data-fade className="services-lede">
            Development, shoot and finish taken as one continuous piece of work
            rather than four handovers.
          </p>
        </div>

        <ul ref={listRef} className="services-list">
          {SERVICES.map((service, i) => (
            <li key={service.name} data-service className="service">
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

        <p data-fade className="services-statement">
          The same hand carries it from the first decision to the master — no film
          handed along in parts.
        </p>
      </div>
    </section>
  );
}
