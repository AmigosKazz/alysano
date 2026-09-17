"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const INTERACTIVE = "a, button, [data-cursor]";

/**
 * A point. Over anything interactive a quiet reticle opens around it; an element
 * carrying `data-cursor="…"` swaps that for a small caption of its own instead.
 * Fine pointers only — touch keeps the native behaviour.
 */
export function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!root || !ring || !label) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    document.documentElement.classList.add("has-cursor");
    gsap.set(ring, { scale: 0.4, opacity: 0 });

    const moveX = gsap.quickTo(root, "x", { duration: 0.14, ease: "power3" });
    const moveY = gsap.quickTo(root, "y", { duration: 0.14, ease: "power3" });

    let visible = false;
    let mode = "";

    const onMove = (event: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.set(root, { x: event.clientX, y: event.clientY });
        gsap.to(root, { opacity: 1, duration: 0.3, overwrite: "auto" });
      }
      moveX(event.clientX);
      moveY(event.clientY);
    };

    const onOver = (event: Event) => {
      const target = event.target as Element | null;
      const named = target?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? "";
      const interactive = Boolean(target?.closest(INTERACTIVE));
      const next = named || (interactive ? "ring" : "");
      if (next === mode) return;
      mode = next;

      if (named) label.textContent = named;
      gsap.to(label, {
        opacity: named ? 1 : 0,
        duration: named ? 0.3 : 0.2,
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(ring, {
        scale: next && !named ? 1 : 0.4,
        opacity: next && !named ? 1 : 0,
        duration: next ? 0.45 : 0.3,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const onLeave = () => {
      visible = false;
      gsap.to(root, { opacity: 0, duration: 0.3, overwrite: "auto" });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div ref={rootRef} className="cursor" aria-hidden="true">
      <span className="cursor-dot" />
      <span ref={ringRef} className="cursor-ring" />
      <span ref={labelRef} className="cursor-label" />
    </div>
  );
}
