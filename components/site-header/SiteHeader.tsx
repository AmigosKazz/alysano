"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { INTRO_EVENT } from "@/lib/intro";

const NAV = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
];

/** Drawn twice inside the accent square so one can roll out as the other arrives. */
function Arrow() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2.6 9.4 9.4 2.6M4.3 2.6h5.1v5.1"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function SiteHeader() {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const header = ref.current;
    if (!header) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(header);

    // A scrim only once the opening shot is behind the visitor.
    mm.add("all", () => {
      ScrollTrigger.create({
        start: () => window.innerHeight * 0.8,
        end: "max",
        onToggle: (self) => header.classList.toggle("is-scrolled", self.isActive),
      });
    });

    // Reveal, cued by the hero — or after a beat on pages without one.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap
        .timeline({ paused: true })
        .fromTo(
          "[data-clip]",
          { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "power3.out" },
          0.8,
        )
        .fromTo(
          "[data-intro]",
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: "power2.out" },
          1.5,
        );

      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        tl.play();
      };
      window.addEventListener(INTRO_EVENT, play);
      const fallback = window.setTimeout(play, 2600);

      return () => {
        window.removeEventListener(INTRO_EVENT, play);
        window.clearTimeout(fallback);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <header ref={ref} className="site-header pointer-events-none">
      <div className="flex items-start justify-between px-5 pt-5 md:px-10 md:pt-8">
        <Link
          href="/"
          className="pointer-events-auto block min-w-0"
          data-cursor="open"
          aria-label="Aly Sanoo — home"
        >
          <span
            data-clip
            className="block font-title text-[15px] uppercase tracking-[0.12em] text-ivory md:text-base"
          >
            Aly Sanoo
          </span>
          <span
            data-intro
            className="mt-1.5 block font-mono text-[9px] uppercase tracking-[0.16em] whitespace-nowrap text-muted md:text-[10px]"
          >
            Post-Production / Sound Designer
          </span>
        </Link>

        <nav aria-label="Primary" className="pointer-events-auto shrink-0">
          <ul className="flex items-center gap-5 md:gap-8">
            {NAV.map((item) => (
              <li key={item.href} data-intro>
                <a
                  href={item.href}
                  data-cursor="open"
                  className="nav-link font-mono text-[10px] uppercase tracking-[0.18em] md:text-[11px]"
                >
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
            <li data-intro className="ml-1 md:ml-4">
              <a href="#contact" className="nav-cta" data-cursor="open" aria-label="Contact">
                <span className="nav-cta-frame">
                  <i className="nav-cta-corners" aria-hidden="true" />
                  <span
                    className="nav-cta-roll font-mono text-[10px] uppercase leading-none tracking-[0.18em] text-ivory md:text-[11px]"
                    aria-hidden="true"
                  >
                    <span>Contact</span>
                    <span>Contact</span>
                  </span>
                </span>
                <span className="nav-cta-arrow">
                  <Arrow />
                  <Arrow />
                </span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
