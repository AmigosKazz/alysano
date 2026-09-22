"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cta } from "@/components/ui/Cta";
import { PROJECTS } from "@/lib/projects";

/** Previews are only worth their bandwidth where there is a pointer to hover with. */
const canHover = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export function Work() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(section);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: section, start: "top 68%" },
        })
        .fromTo("[data-kicker]", { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.9 }, 0)
        .fromTo(
          "[data-lead]",
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1 },
          0.15,
        )
        // Each frame opens from a point at its centre out to full size. The image behind
        // it never moves or scales — the aperture widens onto a picture already there.
        .fromTo(
          "[data-tile]",
          { clipPath: "inset(50% 50% 50% 50%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.35, stagger: 0.1 },
          0.1,
        )
        // The way out arrives once there is something to leave.
        .fromTo("[data-cta]", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.9 }, 0.95);
    });

    return () => mm.revert();
  }, []);

  // The autoplay tiles run as soon as they can, independent of any pointer. The `autoPlay`
  // attribute alone would ignore prefers-reduced-motion, so reduced motion strips it and
  // leaves the poster — the same split the hero and showreel make.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const videos = section.querySelectorAll<HTMLVideoElement>("[data-autoplay] video");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      videos.forEach((video) => {
        video.removeAttribute("autoplay");
        video.pause();
      });
      return;
    }

    videos.forEach((video) => video.play().catch(() => {}));
  }, []);

  // The preview runs from its first frame on every approach, not from wherever it was
  // left, so the same opening beat plays each time — and returns to the poster after.
  // Autoplay tiles are already running on loop, so hover has nothing to add here.
  //
  // `data-autoplay` is set to "" (present, no value) — an empty string is falsy, so this
  // has to test for the attribute's presence, not truthiness of its value.
  const play = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (!canHover() || "autoplay" in event.currentTarget.dataset) return;
    const video = event.currentTarget.querySelector("video");
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  const halt = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if ("autoplay" in event.currentTarget.dataset) return;
    const video = event.currentTarget.querySelector("video");
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  return (
    <section ref={sectionRef} id="work" className="work">
      <div className="work-inner">
        <div className="work-aside">
          <p data-kicker className="work-kicker font-mono">
            Selected projects
          </p>

          <p data-lead className="work-lead">
            A short look at what the edit made films, campaigns and music work, shaped
            frame by frame.
          </p>

          <Cta data-cta href="/work" label="See all work" />
        </div>

        <div className="work-grid">
          {PROJECTS.map((project) => (
            <Link
              key={project.slug}
              data-tile
              data-autoplay={project.autoplay ? "" : undefined}
              href={`/work/${project.slug}`}
              className="work-tile"
              data-span={project.span}
              data-cursor="View"
              onPointerEnter={play}
              onPointerLeave={halt}
            >
              <span className="work-plate">
                <video
                  className="work-video"
                  src={`/video/works/web/${project.slug}.mp4`}
                  poster={`/video/works/web/${project.slug}.jpg`}
                  autoPlay={project.autoplay}
                  muted
                  loop
                  playsInline
                  preload={project.autoplay ? "auto" : "none"}
                  tabIndex={-1}
                  aria-hidden="true"
                  disablePictureInPicture
                  disableRemotePlayback
                />
              </span>

              <span className="work-scrim" aria-hidden="true" />

              <span className="work-meta">
                <span className="work-title">{project.title}</span>
                <span className="work-line font-mono">{project.line}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
