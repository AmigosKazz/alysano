"use client";

import { Fragment, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TITLE = "Built with small crews";

const MANIFESTO = "Because the work is never the work of a single hand";

/** Behind-the-scenes stills, one crew, several sets — the strip runs on a loop. */
const FRAMES = [
  { src: "/images/about/about-8.png", width: 1252, height: 1586 },
  { src: "/images/about/about-4.png", width: 1674, height: 1606 },
  { src: "/images/about/about-15.png", width: 2506, height: 1606 },
  { src: "/images/about/about-12.png", width: 2788, height: 1558 },
  { src: "/images/about/about-1.png", width: 2226, height: 1666 },
  { src: "/images/about/about-9.png", width: 2240, height: 1442 },
  { src: "/images/about/about-16.png", width: 2508, height: 1590 },
  { src: "/images/about/about-3.png", width: 2212, height: 1598 },
  { src: "/images/about/about-5.png", width: 1250, height: 1618 },
  { src: "/images/about/about-13.png", width: 2498, height: 1640 },
  { src: "/images/about/about-11.png", width: 2784, height: 1566 },
  { src: "/images/about/about-7.png", width: 2220, height: 1654 },
  { src: "/images/about/about-2.png", width: 2178, height: 1616 },
  { src: "/images/about/about-14.png", width: 2226, height: 1646 },
  { src: "/images/about/about-6.png", width: 1250, height: 1608 },
  { src: "/images/about/about-10.png", width: 2216, height: 1654 },
];

/** Splits a line into word wrappers so each one can rise out of its own mask. */
function Words({ text }: { text: string }) {
  return text.split(" ").map((word, i) => (
    <Fragment key={`${word}-${i}`}>
      <span data-word className="built-word">
        <span>{word}</span>
      </span>{" "}
    </Fragment>
  ));
}

/** One pass of the strip. Rendered twice, back to back, for a seamless loop. */
function Frames() {
  return (
    <div className="built-frames">
      {FRAMES.map((frame, i) => (
        <Image
          key={`${frame.src}-${i}`}
          src={frame.src}
          width={frame.width}
          height={frame.height}
          alt=""
          sizes="(min-width: 900px) 260px, 160px"
          className="built-frame"
        />
      ))}
    </div>
  );
}

/**
 * The last word before the footer: a statement about who the work is actually
 * made with, and a strip of set photographs running underneath it on a loop.
 * No numbering — the rest of the page doesn't use it, so this doesn't either.
 */
export function Built() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(section);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const words = gsap.utils.toArray<HTMLElement>("[data-word] > span", section);

      gsap
        .timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: section, start: "top 72%" },
        })
        // `y: 0` is pinned alongside `yPercent`: the CSS opening state is a
        // percentage translate, which GSAP reads back as pixels once resolved,
        // and would hold every word down there while yPercent alone ran to 0.
        .fromTo(
          words,
          { yPercent: 108, y: 0 },
          { yPercent: 0, y: 0, duration: 1.3, stagger: 0.03 },
          0,
        )
        .fromTo(
          "[data-fade]",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: "power3.out" },
          0.35,
        );
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="built">
      <div className="built-inner">
        <div className="built-head">
          <div className="built-copy-block">
            <h2 className="built-title font-title">
              <Words text={TITLE} />
            </h2>
            <p data-fade className="built-copy">
              Every project comes together with the same handful of people — a
              camera operator, a gaffer, someone watching sound, a friend who
              shows up to hold a light when the schedule is tight. The edit is
              where it gets shaped, but nothing on this reel was made alone.
            </p>
          </div>

          <p data-fade className="built-manifesto font-mono">
            <span aria-hidden>[</span>
            {MANIFESTO}
            <span aria-hidden>]</span>
          </p>
        </div>
      </div>

      <div className="built-marquee" aria-hidden="true">
        <div className="built-track">
          <Frames />
          <Frames />
        </div>
      </div>
    </section>
  );
}
