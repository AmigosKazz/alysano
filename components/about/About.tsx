"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cta } from "@/components/ui/Cta";

/*** The only place the person, rather than the work, is in view: a frame from the
 * floor, on set, behind the camera. The text column holds the same height as the
 * picture — label at the top, statement at eye level, the way out at the bottom.
 * A teaser: the rest lives on /about.
 */
export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const photo = photoRef.current;
    if (!section || !photo) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(section);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({ scrollTrigger: { trigger: section, start: "top 70%" } })
        .fromTo(
          "[data-kicker]",
          { opacity: 0, x: -8 },
          { opacity: 1, x: 0, duration: 0.9, ease: "power2.out" },
          0,
        )
        // The frame opens upward — every other reveal on the page runs the other way.
        .fromTo(
          "[data-frame]",
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power3.out" },
          0,
        )
        // Each block rises as a whole, so the measure stays intact at any width.
        .fromTo(
          "[data-block]",
          { yPercent: 105 },
          { yPercent: 0, duration: 1.2, stagger: 0.12, ease: "expo.out" },
          0.25,
        )
        .fromTo(
          "[data-fade]",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" },
          0.8,
        );

      // The photograph drifts inside its frame for as long as the section is in view.
      gsap.fromTo(
        photo,
        { yPercent: -4 },
        {
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        },
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="about">
      <div className="about-inner">
        <p data-kicker className="about-kicker font-mono">
          About
        </p>

        <div className="about-statement">
          <div className="about-mask">
            <h2 data-block className="about-headline">
              Most of it happens in the dark.
            </h2>
          </div>
          <div className="about-mask">
            <p data-block className="about-lead">
              Editor and sound designer, working out of Madagascar — how a cut starts,
              who it gets made with, and what it takes to call it finished sits on the
              other page.
            </p>
          </div>
        </div>

        <span data-fade className="about-action">
          <Cta href="/about" label="More about me" />
        </span>

        <div data-frame className="about-frame">
          <div ref={photoRef} className="about-photo">
            <Image
              src="/images/alysano/about-image.jpg"
              alt="Aly Sanoo on set, behind an Alexa with the camera operator, framing a shot"
              fill
              sizes="(min-width: 900px) 48vw, 92vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
