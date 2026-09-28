"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Smooth scrolling for the whole site. Lenis keeps the native scroll position —
 * it only eases its way there — so `position: sticky` and the scroll-driven
 * sections keep working off the same numbers they always did.
 *
 * It is driven off GSAP's ticker rather than its own rAF loop: one loop for the
 * page means the scrub and the scroll can never resolve a frame apart, which is
 * what makes a scrubbed section judder.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      // Long tail, no overshoot — the same easing family the rest of the site uses.
      easing: (t) => 1 - Math.pow(1 - t, 3),
      // A phone's own inertia is better than anything simulated on top of it.
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}
