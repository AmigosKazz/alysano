"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cta } from "@/components/ui/Cta";

/**
 * The one warm frame on a cold site — and the only place the person, rather than
 * the work, is in view. It arrives graded cold and warms up as it settles, which
 * is the job described in a single gesture. A teaser: the rest lives on /about.
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
        // Then the grade arrives: the cold pass lifts off and the warmth lands.
        .fromTo(
          "[data-grade]",
          { opacity: 1 },
          { opacity: 0, duration: 1.8, ease: "power2.inOut" },
          0.5,
        )
        .fromTo(
          "[data-line]",
          { yPercent: 115, y: 0 },
          { yPercent: 0, y: 0, duration: 1.2, stagger: 0.09, ease: "expo.out" },
          0.25,
        )
        .fromTo(
          "[data-fade]",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power2.out" },
          0.7,
        );

      // The photograph drifts inside its frame for as long as the section is in view.
      gsap.fromTo(
        photo,
        { yPercent: -5 },
        {
          yPercent: 5,
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

        <div className="about-body">
          <h2 className="about-title">
            <span className="about-mask">
              <span data-line className="about-line">
                Most of it happens
              </span>
            </span>
            <span className="about-mask">
              <span data-line className="about-line">
                in the dark.
              </span>
            </span>
          </h2>

          <p data-fade className="about-lead">
            Editor and sound designer, working out of Madagascar. The rest — how a cut
            starts, who it gets made with, and what it takes to call it finished — sits on
            the other page.
          </p>

          <p data-fade className="about-meta font-mono">
            <span>Aly Sanoo</span>
            <span>Editor · Sound designer · Madagascar</span>
          </p>

          <span data-fade className="about-action">
            <Cta href="/about" label="More about me" />
          </span>
        </div>

        <div data-frame className="about-frame">
          <div ref={photoRef} className="about-photo">
            <Image
              src="/images/alysano/about.jpg"
              alt="Aly Sanoo at golden hour, camera in hand, looking out to sea"
              fill
              quality={78}
              sizes="(min-width: 900px) 38vw, 86vw"
            />
          </div>
          <span data-grade className="about-grade" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
