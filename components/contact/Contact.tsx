"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LINES = ["Have a story", "to cut?", "Let's talk."];

/**
 * Frames pulled from the edits themselves — the trail is the work, not decoration.
 * Ordered so that no two neighbours in the cycle come from the same film: a sweep
 * never drops the same picture twice in a row.
 */
const FRAMES = Array.from(
  { length: 32 },
  (_, i) => `/images/contact/frame-${String(i + 1).padStart(2, "0")}.jpg`,
);

/**
 * Pointer travel between two frames — measured against the reference, which leaves
 * roughly a frame's width between drops. Any tighter and the run stops reading as
 * separate pictures and turns into one smear.
 */
const SPACING = 120;

/** How far a frame carries on along the path after it lands, in pixels. */
const DRIFT = 34;

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

  // The trail. A frame is dropped wherever the pointer has travelled far enough,
  // tilted along the path, and left to carry on a little way before it burns off.
  // The slots are cycled in order, so the oldest is always the one reused.
  useEffect(() => {
    const section = sectionRef.current;
    const trail = trailRef.current;
    if (!section || !trail) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const frames = gsap.utils.toArray<HTMLElement>(trail.children);

    // The section's box is read on scroll and resize, never inside the move handler:
    // a getBoundingClientRect() per pointer event forces a layout on every frame,
    // which is exactly what makes a trail feel heavy.
    let box = section.getBoundingClientRect();
    const measure = () => {
      box = section.getBoundingClientRect();
    };

    const tilt = gsap.utils.clamp(-19, 19);
    let last: { x: number; y: number } | null = null;
    let next = 0;
    let layer = 1;

    const onMove = (event: PointerEvent) => {
      const x = event.clientX - box.left;
      const y = event.clientY - box.top;

      if (!last) {
        last = { x, y };
        return;
      }

      const dx = x - last.x;
      const dy = y - last.y;
      const travelled = Math.hypot(dx, dy);
      if (travelled < SPACING) return;
      last = { x, y };

      const frame = frames[next % frames.length];
      next += 1;
      layer += 1;

      // Leaning with the path, so a run reads as one gesture — but each frame is
      // thrown down at its own angle on top of that, which is what keeps the edges
      // legible instead of letting the overlap blur into a single band.
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      const drift = DRIFT / travelled;
      const lean = tilt(angle * 0.1) + gsap.utils.random(-12, 12);

      gsap.killTweensOf(frame);
      gsap.set(frame, {
        x,
        y,
        xPercent: -50,
        yPercent: -50,
        zIndex: layer,
        rotate: lean,
        scale: 0.88,
        opacity: 0,
      });

      // A little size variance as well: frames land at slightly different distances.
      const size = gsap.utils.random(0.95, 1.1);

      // Every beat is a different length, all of them long and overlapping: the
      // frame is already settling while it is still arriving, and already leaving
      // while it is still settling. Nothing starts or stops on the same tick.
      gsap
        .timeline()
        .to(frame, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0)
        .to(frame, { scale: size, duration: 0.5, ease: "expo.out" }, 0)
        // Then it recedes for the rest of its life. The run reads as depth: the
        // newest frame is the nearest, the tail falls away behind the pointer.
        .to(frame, { scale: size * 0.5, duration: 2.4, ease: "power1.out" }, 0.5)
        // It keeps going the way it was thrown, and squares up as it slows.
        .to(
          frame,
          { x: x + dx * drift, y: y + dy * drift, duration: 2.4, ease: "power2.out" },
          0,
        )
        .to(frame, { rotate: lean * 0.55, duration: 2.4, ease: "power2.out" }, 0)
        // The way out is the slowest thing it does — a dissolve, not a cut.
        .to(frame, { opacity: 0, duration: 1.05, ease: "power1.inOut" }, 2.1);
    };

    section.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      section.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      gsap.killTweensOf(frames);
    };
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="contact">
      <div ref={trailRef} className="contact-trail" aria-hidden="true">
        {FRAMES.map((src, i) => (
          <Image
            key={`${src}-${i}`}
            src={src}
            alt=""
            width={520}
            height={390}
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
