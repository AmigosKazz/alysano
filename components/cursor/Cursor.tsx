"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const INTERACTIVE = "a, button, [data-cursor]";

/**
 * A point. Over anything interactive a quiet reticle opens around it.
 * Fine pointers only — touch keeps the native behaviour.
 */
export function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const ring = ringRef.current;
    if (!root || !ring) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    document.documentElement.classList.add("has-cursor");
    gsap.set(ring, { scale: 0.4, opacity: 0 });

    const moveX = gsap.quickTo(root, "x", { duration: 0.14, ease: "power3" });
    const moveY = gsap.quickTo(root, "y", { duration: 0.14, ease: "power3" });

    let visible = false;
    let active = false;

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
      const next = Boolean((event.target as Element | null)?.closest(INTERACTIVE));
      if (next === active) return;
      active = next;
      gsap.to(ring, {
        scale: next ? 1 : 0.4,
        opacity: next ? 1 : 0,
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
    </div>
  );
}
