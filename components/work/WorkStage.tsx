"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { PROJECTS } from "@/lib/projects";

const COUNT = PROJECTS.length;

/**
 * The work, one film at a time. Three panels cut from the same edit stand side by
 * side on a dark stage; the reel moves sideways and the title changes with it.
 *
 * The screen itself is the control: the left half steps back, the right half steps
 * forward. The two marks at the corner say so out loud, and carry the action for
 * touch and for the keyboard.
 */
export function WorkStage() {
  const stageRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const project = PROJECTS[index];
  const next = PROJECTS[(index + 1) % COUNT];

  const go = useCallback((step: 1 | -1) => {
    setIndex((i) => (i + step + COUNT) % COUNT);
  }, []);

  // The reel slides, and the panels stretch along the way — a smear rather than a
  // blur, so the whole move stays on transforms and holds its frame rate.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track) return;

    const mm = gsap.matchMedia(stage);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline()
        .to(track, { xPercent: -100 * index, duration: 1.05, ease: "power3.inOut" }, 0)
        .to(
          "[data-panels]",
          { scaleX: 1.07, duration: 0.5, ease: "power2.out", yoyo: true, repeat: 1 },
          0,
        )
        .fromTo(
          "[data-swap]",
          { yPercent: 110 },
          { yPercent: 0, duration: 0.9, stagger: 0.06, ease: "expo.out" },
          0.12,
        );
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(track, { xPercent: -100 * index });
    });

    return () => mm.revert();
  }, [index]);

  // Only the film on screen runs, and it runs from its first frame every time.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const videos = stage.querySelectorAll<HTMLVideoElement>("video");

    videos.forEach((video, i) => {
      if (i === index && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [index]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <section ref={stageRef} className="stage">
      <div className="stage-reel">
        <div ref={trackRef} className="stage-track">
          {PROJECTS.map((item, i) => (
            <article key={item.slug} className="slide" aria-hidden={i !== index}>
              <div data-panels className="slide-panels">
                <span className="panel panel-left">
                  <Image
                    src={`/images/work/${item.slug}-a.jpg`}
                    alt=""
                    width={440}
                    height={782}
                    sizes="16vw"
                  />
                </span>

                <span className="panel panel-mid">
                  <video
                    src={`/video/works/web/${item.slug}.mp4`}
                    poster={`/images/work/${item.slug}-b.jpg`}
                    muted
                    loop
                    playsInline
                    preload={i === 0 ? "auto" : "none"}
                    tabIndex={-1}
                    aria-hidden="true"
                    disablePictureInPicture
                    disableRemotePlayback
                  />
                </span>

                <span className="panel panel-right">
                  <Image
                    src={`/images/work/${item.slug}-c.jpg`}
                    alt=""
                    width={440}
                    height={782}
                    sizes="16vw"
                  />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* The screen as the control. Behind the bar, so the marks keep their own hit area. */}
      <button
        type="button"
        className="stage-zone stage-zone-prev"
        data-cursor="Prev"
        onClick={() => go(-1)}
        aria-label="Previous project"
      />
      <button
        type="button"
        className="stage-zone stage-zone-next"
        data-cursor="Next"
        onClick={() => go(1)}
        aria-label="Next project"
      />

      <div className="stage-bar">
        <div className="stage-head">
          <h1 className="stage-title font-title">
            <span className="stage-mask">
              <span data-swap key={project.slug} className="stage-line">
                {project.title}
              </span>
            </span>
          </h1>
          <p className="stage-line-meta font-mono">
            <span className="stage-mask">
              <span data-swap key={`${project.slug}-meta`} className="stage-line">
                {project.line}
              </span>
            </span>
          </p>
        </div>

        <div className="stage-aside">
          <p className="stage-next font-mono">
            <span className="stage-next-label">Next</span>
            <span className="stage-mask">
              <span data-swap key={`${next.slug}-next`} className="stage-line">
                {next.title}
              </span>
            </span>
          </p>

          <div className="stage-marks">
            <button
              type="button"
              className="stage-mark"
              onClick={() => go(1)}
              aria-label="Next project"
            >
              <Chevron />
            </button>
            <button
              type="button"
              className="stage-mark stage-mark-back"
              onClick={() => go(-1)}
              aria-label="Previous project"
            >
              <Chevron />
            </button>
          </div>
        </div>
      </div>

      <p className="stage-count font-mono" aria-live="polite">
        {String(index + 1).padStart(2, "0")} / {String(COUNT).padStart(2, "0")}
      </p>
    </section>
  );
}

/** One glyph, turned around for the way back. */
function Chevron() {
  return (
    <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true">
      <path
        d="M1 1l4 4-4 4M7 1l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
    </svg>
  );
}
