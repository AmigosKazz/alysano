"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const INTERACTIVE = "a, button, [data-cursor]";

/** Points in the tail. More reads as a longer streak; each one lags the one before it. */
const TRAIL = 18;

/** How hard each point is pulled toward its predecessor — lower drags a longer tail. */
const PULL = 0.42;

/**
 * A point that draws where it has just been. The tail is a chain of followers, each
 * easing toward the one ahead of it, so it stretches out when the pointer moves fast
 * and collapses back into the dot the moment it stops. Elements carrying
 * `data-cursor="…"` still name themselves in a small caption.
 * Fine pointers only — touch keeps the native behaviour.
 */
export function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const head = headRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    const path = pathRef.current;
    if (!root || !head || !dot || !label || !path) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    document.documentElement.classList.add("has-cursor");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const points = Array.from({ length: TRAIL }, () => ({ ...target }));
    let visible = false;
    let mode = "";
    let raf = 0;

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;

      // First sighting: collapse the whole chain onto the pointer so the tail does
      // not come whipping in from wherever it was left.
      if (!visible) {
        visible = true;
        for (const point of points) {
          point.x = target.x;
          point.y = target.y;
        }
        gsap.to(root, { opacity: 1, duration: 0.3, overwrite: "auto" });
      }
    };

    const tick = () => {
      points[0].x += (target.x - points[0].x) * 0.55;
      points[0].y += (target.y - points[0].y) * 0.55;
      for (let i = 1; i < points.length; i += 1) {
        points[i].x += (points[i - 1].x - points[i].x) * PULL;
        points[i].y += (points[i - 1].y - points[i].y) * PULL;
      }

      head.style.transform = `translate3d(${points[0].x}px, ${points[0].y}px, 0)`;

      // Quadratics through the midpoints: the chain reads as one curve rather than
      // a run of straight segments.
      let d = `M${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
      for (let i = 1; i < points.length - 1; i += 1) {
        const mx = (points[i].x + points[i + 1].x) / 2;
        const my = (points[i].y + points[i + 1].y) / 2;
        d += `Q${points[i].x.toFixed(1)} ${points[i].y.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
      }
      path.setAttribute("d", d);

      raf = requestAnimationFrame(tick);
    };

    const onOver = (event: Event) => {
      const el = event.target as Element | null;
      const named = el?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? "";
      const interactive = Boolean(el?.closest(INTERACTIVE));
      const next = named || (interactive ? "open" : "");
      if (next === mode) return;
      mode = next;

      if (named) label.textContent = named;
      gsap.to(label, {
        opacity: named ? 1 : 0,
        duration: named ? 0.3 : 0.2,
        ease: "power2.out",
        overwrite: "auto",
      });
      // No ring here — it would fight the tail. The point simply opens up instead.
      gsap.to(dot, {
        scale: next ? 2.1 : 1,
        duration: 0.45,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const onLeave = () => {
      visible = false;
      gsap.to(root, { opacity: 0, duration: 0.3, overwrite: "auto" });
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div ref={rootRef} className="cursor" aria-hidden="true">
      <svg className="cursor-trail" width="100%" height="100%">
        <path ref={pathRef} />
      </svg>

      <div ref={headRef} className="cursor-head">
        <span ref={dotRef} className="cursor-dot" />
        <span ref={labelRef} className="cursor-label" />
      </div>
    </div>
  );
}
