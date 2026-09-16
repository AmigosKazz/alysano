"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Minimal custom cursor for fine pointers only. A small dot; over anything
 * carrying `data-cursor="play|open"` it opens into a quiet ring with a label.
 */
export function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!root || !dot || !ring || !label) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    document.documentElement.classList.add("has-cursor");
    gsap.set(ring, { scale: 0 });

    const moveX = gsap.quickTo(root, "x", { duration: 0.14, ease: "power3" });
    const moveY = gsap.quickTo(root, "y", { duration: 0.14, ease: "power3" });

    let visible = false;
    let mode: string | null = null;

    const setMode = (next: string | null) => {
      if (next === mode) return;
      mode = next;
      if (next) label.textContent = next;
      gsap.to(dot, { scale: next ? 0 : 1, duration: 0.3, ease: "power3.out", overwrite: "auto" });
      gsap.to(ring, { scale: next ? 1 : 0, duration: 0.4, ease: "power3.out", overwrite: "auto" });
      gsap.to(label, { opacity: next ? 1 : 0, duration: 0.25, ease: "power2.out", overwrite: "auto" });
    };

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
      const target = (event.target as Element | null)?.closest<HTMLElement>("[data-cursor]");
      setMode(target?.dataset.cursor?.toUpperCase() ?? null);
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
      <span ref={dotRef} className="cursor-dot" />
      <span ref={ringRef} className="cursor-ring">
        <span ref={labelRef} className="cursor-label" />
      </span>
    </div>
  );
}
