"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { INTRO_EVENT } from "@/lib/intro";

const NAV = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

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
            className="block font-sans text-[12px] font-medium uppercase tracking-[0.22em] text-ivory md:text-[13px]"
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
          <ul className="flex gap-5 md:gap-8">
            {NAV.map((item) => (
              <li key={item.href} data-intro>
                <a
                  href={item.href}
                  data-cursor="open"
                  className="font-mono text-[10px] uppercase tracking-[0.18em] text-ivory/70 transition-colors duration-300 hover:text-ivory md:text-[11px]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
