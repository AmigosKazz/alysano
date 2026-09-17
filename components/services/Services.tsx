"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Service = { name: string; detail: string };

const SERVICES: Service[] = [
  { name: "Directing", detail: "Concept · Direction · On set" },
  { name: "Editing", detail: "Structure · Rhythm · Pacing" },
  { name: "Post-production", detail: "Conform · Colour · Finish" },
  { name: "Sound Design", detail: "Mix · Foley · Atmosphere" },
  { name: "Production Design", detail: "Sets · Props · Art direction" },
  { name: "Full Visual Production", detail: "From brief to master" },
];

/**
 * Six lines in outline, over one photograph of the room they happen in. Approaching a
 * line fills it in — the wipe the rest of the site uses — and the room answers: the
 * frame lifts out of the dark and drifts with wherever you are in the list. Nothing
 * here is a card and nothing carries an icon.
 */
export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    const list = listRef.current;
    if (!section || !media || !list) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(section);

    // ---- Arrival ------------------------------------------------------------
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({ scrollTrigger: { trigger: section, start: "top 68%" } })
        .fromTo(
          "[data-kicker]",
          { opacity: 0, x: -8 },
          { opacity: 1, x: 0, duration: 0.9, ease: "power2.out" },
          0,
        )
        // The photograph is uncovered from its own right edge, against the reading direction.
        .fromTo(
          media,
          { clipPath: "inset(0% 0% 0% 100%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "power3.out" },
          0,
        )
        .fromTo(
          "[data-rule]",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.1, stagger: 0.07, ease: "power3.inOut" },
          0.2,
        )
        // `y: 0` pins the pixel component: the CSS opening state is a percentage translate,
        // which GSAP reads back out of the matrix as an absolute y and would otherwise keep.
        .fromTo(
          "[data-name]",
          { yPercent: 142, y: 0 },
          { yPercent: 0, y: 0, duration: 1.3, stagger: 0.07, ease: "expo.out" },
          0.24,
        );
    });

    // ---- The room answers the list ------------------------------------------
    mm.add("(hover: hover) and (prefers-reduced-motion: no-preference)", () => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-service]", list);
      const driftTo = gsap.quickTo(media, "yPercent", { duration: 1, ease: "power3" });
      const scaleTo = gsap.quickTo(media, "scale", { duration: 1.2, ease: "power3" });
      const centre = (rows.length - 1) / 2;

      const enter = (index: number) => () => {
        // Rows above the middle pull the frame up, rows below push it down.
        driftTo((index - centre) * 1.7);
        scaleTo(1.06);
        gsap.to(media, { opacity: 0.66, duration: 0.8, ease: "power2.out", overwrite: "auto" });
      };

      const leave = () => {
        driftTo(0);
        scaleTo(1);
        gsap.to(media, { opacity: 0.38, duration: 1.2, ease: "power2.out", overwrite: "auto" });
      };

      const handlers = rows.map((row, index) => {
        const on = enter(index);
        row.addEventListener("pointerenter", on);
        return () => row.removeEventListener("pointerenter", on);
      });
      list.addEventListener("pointerleave", leave);

      return () => {
        handlers.forEach((off) => off());
        list.removeEventListener("pointerleave", leave);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="services" className="services">
      <div ref={mediaRef} className="services-media" aria-hidden="true">
        <Image
          src="/images/alysano/working.jpg"
          alt=""
          fill
          quality={72}
          sizes="100vw"
          className="services-photo"
        />
        <span className="services-scrim" />
      </div>

      <div className="services-inner">
        <p data-kicker className="services-kicker font-mono">
          Services
        </p>

        <ul ref={listRef} className="services-list">
          {SERVICES.map((service, i) => (
            <li key={service.name} data-service className="service">
              <span data-rule className="service-rule" aria-hidden="true" />

              <span className="service-index font-mono">{String(i + 1).padStart(2, "0")}</span>

              <span className="service-mask">
                <span data-name className="service-name">
                  <span className="service-outline">{service.name}</span>
                  {/* The solid cut of the same word, wiped in from the left on approach. */}
                  <span className="service-fill" aria-hidden="true">
                    {service.name}
                  </span>
                </span>
              </span>

              <span className="service-detail font-mono">{service.detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
