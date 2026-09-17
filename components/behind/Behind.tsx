"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CLIENTS = [
  { name: "Masaya Post Production", src: "/images/trusted-logo/masaya.png", w: 2162, h: 456 },
  { name: "A58 Studios", src: "/images/trusted-logo/A58 studios.png", w: 1424, h: 1105 },
  { name: "DL Visual", src: "/images/trusted-logo/dl-visual.png", w: 1254, h: 1254 },
  { name: "Well Done Production", src: "/images/trusted-logo/well-done.png", w: 2172, h: 724 },
];

const DISCIPLINES = ["Editing", "Post-production", "Sound design", "Direction"];

/** 02 — Behind the work. Type and the people he cuts for; no imagery competing with it. */
export function Behind() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(section);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]", section).forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(0 0 100% 0)", y: 18 },
          {
            clipPath: "inset(0 0 0% 0)",
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-rule]", section).forEach((rule) => {
        gsap.fromTo(
          rule,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "power3.inOut",
            scrollTrigger: { trigger: rule, start: "top 94%" },
          },
        );
      });

      const stagger = (selector: string, trigger: string) =>
        gsap.fromTo(
          selector,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: { trigger, start: "top 88%" },
          },
        );

      stagger("[data-logo]", ".behind-clients");
      stagger("[data-row]", ".behind-index");
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="behind">
      <div className="behind-inner">
        {/*<div className="behind-clients">*/}
        {/*  <p className="font-mono behind-clients-label">Trusted by</p>*/}
        {/*  <ul className="behind-logos">*/}
        {/*    {CLIENTS.map((client) => (*/}
        {/*      <li key={client.name} data-logo>*/}
        {/*        <Image*/}
        {/*          src={client.src}*/}
        {/*          alt={client.name}*/}
        {/*          width={client.w}*/}
        {/*          height={client.h}*/}
        {/*          sizes="180px"*/}
        {/*        />*/}
        {/*      </li>*/}
        {/*    ))}*/}
        {/*  </ul>*/}
        {/*</div>*/}

        <div className="behind-grid">
          <h2 className="behind-title font-title" data-reveal>
            Behind
            <br />
            the work
          </h2>

          <div className="behind-copy">
            <p className="behind-lead" data-reveal>
              Aly Sanoo is a Madagascar-based editor and sound designer. He works in
              post-production, in sound, or in a combined role depending on the film, bringing
              rhythm and atmosphere to each one, with story-building at the heart of the work.
            </p>

            <ul className="behind-index font-mono">
              {DISCIPLINES.map((item, i) => (
                <li key={item} data-row>
                  <span className="behind-index-no">{String(i + 1).padStart(2, "0")}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
