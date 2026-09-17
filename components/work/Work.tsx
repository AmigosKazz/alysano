"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Project = {
  slug: string;
  title: string;
  line: string;
  /** Column weight in the five-column band — the two sizes alternate per row. */
  span: 3 | 2;
};

// Titles are working titles on the supplied footage; swap them for the real ones.
const PROJECTS: Project[] = [
  { slug: "work-01", title: "Night Parade", line: "Music video — edit, sound design", span: 3 },
  { slug: "work-02", title: "Plumage", line: "Music video — edit", span: 2 },
  { slug: "work-03", title: "Stairwell", line: "Music video — edit, sound design", span: 2 },
  { slug: "work-04", title: "Nocturne", line: "Commercial — edit, post", span: 3 },
];

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
        .fromTo("[data-aside]", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1, stagger: 0.12 }, 0)
        // Each frame is uncovered from the top edge down while the image inside settles
        // back from a wider crop — the cut, not a fade.
        .fromTo(
          "[data-tile]",
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.25, stagger: 0.09 },
          0.1,
        )
        .fromTo(
          "[data-plate]",
          { scale: 1.22 },
          { scale: 1, duration: 1.7, stagger: 0.09, ease: "power4.out" },
          0.1,
        );
    });

    return () => mm.revert();
  }, []);

  const play = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (!canHover()) return;
    event.currentTarget.querySelector("video")?.play().catch(() => {});
  };

  const halt = (event: React.PointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.querySelector("video")?.pause();
  };

  return (
    <section ref={sectionRef} id="work" className="work">
      <div className="work-inner">
        <div className="work-aside">
          <p data-aside className="work-kicker font-mono">
            Selected projects
          </p>

          <p data-aside className="work-lead">
            A short look at what the edit made — films, campaigns and music work, shaped
            frame by frame.
          </p>

          <Link data-aside href="/work" className="work-all font-mono">
            <span>See all work</span>
            <svg width="13" height="9" viewBox="0 0 13 9" fill="none" aria-hidden="true">
              <path
                d="M0 4.5h11M8 1l3.5 3.5L8 8"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="square"
              />
            </svg>
          </Link>
        </div>

        <div className="work-grid">
          {PROJECTS.map((project) => (
            <Link
              key={project.slug}
              data-tile
              href={`/work/${project.slug}`}
              className="work-tile"
              data-span={project.span}
              data-cursor="View"
              onPointerEnter={play}
              onPointerLeave={halt}
            >
              <span data-plate className="work-plate">
                <video
                  className="work-video"
                  src={`/video/works/web/${project.slug}.mp4`}
                  poster={`/video/works/web/${project.slug}.jpg`}
                  muted
                  loop
                  playsInline
                  preload="none"
                  tabIndex={-1}
                  aria-hidden="true"
                  disablePictureInPicture
                  disableRemotePlayback
                />
              </span>

              <span className="work-veil" aria-hidden="true" />
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
