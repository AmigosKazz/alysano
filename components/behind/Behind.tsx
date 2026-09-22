"use client";

import { Fragment, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const HEADLINE = "Footage arrives raw. The story is made in the edit.";

const BODY = [
  "Rhythm is the first decision. Where a cut lands, how long a look is held, when a sound arrives a beat before the image — that is where a sequence stops being footage and starts being a story.",
  "Structure, silence, grade and sound are treated as one material, worked until the finished piece carries the intention the shoot went out with.",
];

/**
 * The panel that wipes over the hero. A bracketed label, a condensed statement
 * and two paragraphs held in a left column — the right half stays empty.
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
          { yPercent: 0, y: 0, duration: 1.5, stagger: 0.03 },
          0.15,
        )
        .fromTo(
          "[data-body] p",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 1.4, stagger: 0.12, ease: "power3.out" },
          0.5,
        );
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="behind" className="behind">
      <div className="behind-inner">
        <p data-eyebrow className="behind-eyebrow font-mono">
          <span aria-hidden>[</span>
          Behind the work
          <span aria-hidden>]</span>
        </p>

        {/* The space lives between the wrappers, not inside them: trailing whitespace
            in an inline-block collapses, and the words would run together. */}
        <h2 className="behind-lead font-title">
          {HEADLINE.split(" ").map((word, i) => (
            <Fragment key={`${word}-${i}`}>
              <span data-word className="behind-word">
                <span>{word}</span>
              </span>{" "}
            </Fragment>
          ))}
        </h2>

        <div data-body className="behind-body">
          {BODY.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
