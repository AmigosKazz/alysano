"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Figure = { value: string; label: string };

// Placeholder counts on the six cards — replace with the real ones.
const FIGURES: Figure[] = [
  { value: "+120", label: "Projects delivered" },
  { value: "40+", label: "Artists & brands" },
  { value: "+25M", label: "Views generated" },
  { value: "6+", label: "Years in post" },
  { value: "30+", label: "Films & music videos" },
  { value: "+9", label: "Countries reached" },
];

/**
 * Each digit is its own column: a strip of 0–9 repeated a few times with the real
 * digit at both ends. The strip starts showing the target — so the value is correct
 * before JS and without it — and the effect drops it back to the leading zero before
 * spinning it home. Columns further right carry more turns and take longer, so the
 * number settles left to right and reads wrong on the way, the way a counter does.
 */
function digitCells(digit: string, column: number) {
  const turns = 2 + column;
  const cells = [digit];
  for (let t = 0; t < turns; t += 1) {
    for (let d = 0; d < 10; d += 1) cells.push(String(d));
  }
  cells.push(digit);
  return cells;
}

function Value({ value }: { value: string }) {
  let column = -1;

  return (
    <span className="fig-value" aria-hidden="true">
      {[...value].map((char, i) => {
        if (!/\d/.test(char)) {
          return (
            <span key={i} className="fig-fixed">
              {char}
            </span>
          );
        }

        column += 1;
        const cells = digitCells(char, column);

        return (
          <span key={i} className="fig-digit">
            <span data-strip className="fig-strip">
              {cells.map((cell, c) => (
                <span key={c}>{cell}</span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function Figures() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(section);

    const cards = () => gsap.utils.toArray<HTMLElement>(".fig-card", section);
    const strips = (card: HTMLElement) =>
      gsap.utils.toArray<HTMLElement>("[data-strip]", card);

    // A strip of n cells shows its last one at this offset.
    const landed = (strip: HTMLElement) => -100 * ((strip.children.length - 1) / strip.children.length);
    const leadingZero = (strip: HTMLElement) => -100 / strip.children.length;

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 78%" },
      });

      tl.fromTo("[data-kicker]", { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.9 }, 0);

      cards().forEach((card, index) => {
        const at = index * 0.12;

        tl.fromTo(
          card,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" },
          at,
        );

        strips(card).forEach((strip, column) => {
          tl.fromTo(
            strip,
            { yPercent: leadingZero(strip) },
            {
              yPercent: landed(strip),
              duration: 1.5 + column * 0.22,
              ease: "power3.out",
            },
            at,
          );
        });
      });
    });

    // No roll: the strips simply sit on the number.
    mm.add("(prefers-reduced-motion: reduce)", () => {
      cards().forEach((card) => {
        strips(card).forEach((strip) => gsap.set(strip, { yPercent: landed(strip) }));
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="figures" className="figures">
      <div className="figures-inner">
        <p data-kicker className="figures-kicker font-mono">
          Key figures
        </p>

        <div className="figures-grid">
          {FIGURES.map((figure, i) => (
            <div key={figure.label} className="fig-card">
              <span className="fig-index font-mono">{i + 1}.</span>
              <p className="fig-number">
                <span className="sr-only">{figure.value}</span>
                <Value value={figure.value} />
              </p>
              <span className="fig-label">{figure.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
