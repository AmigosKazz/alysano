"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LINES = ["Have a story", "to cut?", "Let's talk."];

/** Frames pulled from the edits themselves — the trail is the work, not decoration. */
const FRAMES = Array.from(
  { length: 12 },
  (_, i) => `/images/contact/frame-${String(i + 1).padStart(2, "0")}.jpg`,
);

/** Pointer travel between two frames. Lower drops more film on the floor. */
const SPACING = 112;

/**
 * The last room. One line, held in the middle of an empty screen, and a trail of
 * frames that the pointer pulls out behind it — the reel coming apart over the
 * invitation. Fine pointers only: on touch the statement stands on its own.
 */
export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(section);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // `y: 0` pinned on both ends — otherwise the percentage translate the CSS
      // opening state leaves behind survives as pixels and the line stays masked.
      gsap.fromTo(
        "[data-line]",
        { yPercent: 108, y: 0 },
        {
          yPercent: 0,
          y: 0,
          duration: 1.3,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: { trigger: section, start: "top 65%" },
        },
      );
    });

    return () => mm.revert();
  }, []);

  // The trail. Each frame is dropped where the pointer crossed, rotated a little off
  // square, and left to burn off on its own — a fixed pool cycled in order, so the
  // oldest is always the one reused.
  useEffect(() => {
    const section = sectionRef.current;
    const trail = trailRef.current;
    if (!section || !trail) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const frames = gsap.utils.toArray<HTMLElement>(trail.children);
    let last: { x: number; y: number } | null = null;
    let next = 0;
    let layer = 1;

    const onMove = (event: PointerEvent) => {
      const box = section.getBoundingClientRect();
      const x = event.clientX - box.left;
      const y = event.clientY - box.top;

      if (last && Math.hypot(x - last.x, y - last.y) < SPACING) return;
      last = { x, y };

      const frame = frames[next % frames.length];
      next += 1;
      layer += 1;

      gsap.killTweensOf(frame);
      gsap.set(frame, {
        x,
        y,
        xPercent: -50,
        yPercent: -50,
        zIndex: layer,
        rotate: gsap.utils.random(-13, 13),
        scale: 0.82,
        opacity: 0,
      });

      gsap
        .timeline()
        .to(frame, { opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" })
        .to(frame, { opacity: 0, scale: 0.9, duration: 0.9, ease: "power2.inOut" }, 1.1);
    };

    section.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      section.removeEventListener("pointermove", onMove);
      gsap.killTweensOf(frames);
    };
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="contact">
      <div ref={trailRef} className="contact-trail" aria-hidden="true">
        {FRAMES.map((src) => (
          <Image
            key={src}
            src={src}
            alt=""
            width={520}
            height={293}
            className="contact-frame"
          />
        ))}
      </div>

      <Link href="/contact" className="contact-statement font-title" data-cursor="Let's talk">
        {LINES.map((line) => (
          <span key={line} className="contact-mask">
            <span data-line className="contact-line">
              {line}
            </span>
          </span>
        ))}
      </Link>
    </section>
  );
}
