"use client";

import { Fragment, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LEAD =
  "Footage arrives as raw material. The story is made afterwards — in the rhythm of a cut, the weight of a held silence, the moment sound lands a beat before the image.";

/**
 * The panel that wipes over the hero. Type only, no portrait and no name: the
 * visitor gets the position first and the person later.
 */
export function Behind() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(section);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Each word rises out of its own line box. The wrappers are clipped in CSS,
      // so only one transform per word is animated here.
      const words = gsap.utils.toArray<HTMLElement>("[data-word] > span", section);

      gsap
        .timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: section, start: "top 72%" },
        })
        .fromTo(
          "[data-eyebrow]",
          { opacity: 0, x: -8 },
          { opacity: 1, x: 0, duration: 1, ease: "power2.out" },
          0,
        )
        // `y: 0` is not decoration. The opening state in CSS is a percentage translate,
        // which computes to a matrix in pixels; GSAP reads that back as an absolute `y`
        // and would hold every word down there while yPercent alone ran to 0.
        .fromTo(
          words,
          { yPercent: 108, y: 0 },
          { yPercent: 0, y: 0, duration: 1.5, stagger: 0.022 },
          0.15,
        );
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="behind">
      <div className="behind-inner">
        <p data-eyebrow className="behind-eyebrow font-mono">
          Behind the work
        </p>

        {/* The space lives between the wrappers, not inside them: trailing whitespace
            in an inline-block collapses, and the words would run together. */}
        <p className="behind-lead">
          {LEAD.split(" ").map((word, i) => (
            <Fragment key={`${word}-${i}`}>
              <span data-word className="behind-word">
                <span>{word}</span>
              </span>{" "}
            </Fragment>
          ))}
        </p>
      </div>
    </section>
  );
}
