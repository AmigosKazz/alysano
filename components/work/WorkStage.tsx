"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FramedCta } from "@/components/ui/FramedCta";
import { PROJECTS } from "@/lib/projects";

/** Marks the four corners of the window, the way a camera frames its shot. */
function Marks() {
  return (
    <span className="reel-marks" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

/**
 * The work, one film at a time on a full screen.
 *
 * Each project is a whole screen: its own footage blown up behind, dimmed to
 * atmosphere, and the same shot held sharp in a framed window at the centre —
 * the picture, and the room it is watched in. The title stands off its left
 * edge, what it is off its right.
 *
 * Scrolling raises the next one over the last like a curtain: one clip edge
 * crosses the whole screen, background and window together, so the cut reads
 * as one move rather than two elements changing. The mapping is linear — a
 * screen of scroll per film, no holds — so the page never stalls under it.
 */
export function WorkStage() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(section);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const slides = gsap.utils.toArray<HTMLElement>("[data-slide]", section);
      // The first is simply there; every one after it is raised over the last.
      const rising = slides.slice(1);
      const setters = rising.map((slide) => gsap.quickSetter(slide, "clipPath"));
      const videos = gsap.utils.toArray<HTMLVideoElement>("video", section);
      const setHint = gsap.quickSetter(section.querySelector("[data-hint]")!, "opacity");

      const render = (progress: number) => {
        const head = progress * rising.length;
        rising.forEach((_, i) => {
          // 0 → still below the frame, 1 → fully up. One screen of scroll each.
          // The clip opens from the bottom edge: scrolling down brings the next
          // film up from under the last, which is the way the reel reads.
          const t = gsap.utils.clamp(0, 1, head - i);
          setters[i](`inset(${(1 - t) * 100}% 0% 0% 0%)`);
        });
        // The hint belongs to the first screen only.
        setHint(1 - gsap.utils.clamp(0, 1, head / 0.18));
      };

      render(0);

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${rising.length * window.innerHeight}`,
        invalidateOnRefresh: true,
        onUpdate: (self) => render(self.progress),
      });

      // Only what is on screen decodes. Four films at once is four decoders.
      const watch = ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          videos.forEach((video) => {
            if (self.isActive) video.play().catch(() => {});
            else video.pause();
          });
        },
      });

      return () => {
        trigger.kill();
        watch.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="reel">
      <div className="reel-stage">
        {PROJECTS.map((project, i) => (
          <article key={project.slug} data-slide className="reel-slide" style={{ zIndex: i }}>
            {/* The same shot, blown past the edges and held under the type. */}
            <div className="reel-bg" aria-hidden="true">
              <video
                src={`/video/works/web/${project.slug}.mp4`}
                poster={`/video/works/web/${project.slug}.jpg`}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                tabIndex={-1}
                disablePictureInPicture
              />
            </div>

            <p className="reel-title font-title">{project.title}</p>

            <figure className="reel-frame">
              <video
                src={`/video/works/web/${project.slug}.mp4`}
                poster={`/video/works/web/${project.slug}.jpg`}
                aria-label={`${project.title} — ${project.line}`}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                tabIndex={-1}
                disablePictureInPicture
              />
              <Marks />
              <span className="reel-cross" aria-hidden="true" />
            </figure>

            <p className="reel-kind font-title">{project.kind}</p>
          </article>
        ))}

        {/* The last screen: the reel gives way to the invitation. */}
        <article data-slide className="reel-slide reel-outro" style={{ zIndex: PROJECTS.length }}>
          <p className="reel-outro-kicker font-title">The footage is the material.</p>
          <h2 className="reel-outro-line font-title">
            The film
            <br />
            is the edit.
          </h2>
          <FramedCta href="/contact" label="Start a project" wide />
        </article>

        {/* Only on the first screen: once the reel is moving it has said its
            piece, so it fades out over the opening curtain. */}
        <p data-hint className="reel-hint font-mono" aria-hidden="true">
          scroll
          <svg width="9" height="11" viewBox="0 0 9 11" fill="none">
            <path
              d="M4.5 0v9.5M1 6.5l3.5 3.5L8 6.5"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="square"
            />
          </svg>
        </p>
      </div>

      {/* One screen of scroll per slide: the stage is held for as long as there
          are curtains left to raise, and the last one is the outro's. */}
      <div className="reel-steps" aria-hidden="true">
        {Array.from({ length: PROJECTS.length + 1 }, (_, i) => (
          <div key={i} className="reel-step" />
        ))}
      </div>
    </section>
  );
}
