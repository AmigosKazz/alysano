"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Showreel } from "@/components/showreel/Showreel";
import { INTRO_EVENT } from "@/lib/intro";

const HEADLINE = ["Cutting", "images into", "stories."];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const foreRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    const fore = foreRef.current;
    const video = videoRef.current;
    const headline = headlineRef.current;
    if (!section || !media || !fore || !video || !headline) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(section);

    // React does not serialise `muted` into server HTML; without it Chrome refuses to autoplay.
    video.muted = true;
    video.defaultMuted = true;

    // Anything marked [data-intro] joins the opening reveal — collected loosely so
    // composition changes never leave the timeline holding a missing element.
    const meta = () => gsap.utils.toArray<HTMLElement>("[data-intro]", section);

    // ---- Opening sequence ---------------------------------------------------
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      video.play().catch(() => {});

      const lines = gsap.utils.toArray<HTMLElement>("[data-line]", headline);

      const tl = gsap
        .timeline({ paused: true, defaults: { ease: "power3.out" } })
        // 0.4s — the image surfaces out of the dark, settling from a hair larger.
        .fromTo(video, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out" }, 0.4)
        .fromTo(video, { scale: 1.04 }, { scale: 1, duration: 1.4 }, 0.4)
        // 1.1s — headline, line by line, unmasked with a few pixels of lift.
        .fromTo(
          lines,
          { clipPath: "inset(0 0 100% 0)", y: 20 },
          { clipPath: "inset(0 0 0% 0)", y: 0, duration: 0.7, stagger: 0.1 },
          1.1,
        )
        // 1.5s — the showreel call arrives last, quietly.
        .fromTo(
          meta(),
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: "power2.out" },
          1.5,
        )
        // Afterwards the image breathes, barely.
        .to(video, { scale: 1.025, duration: 14, ease: "sine.inOut", repeat: -1, yoyo: true }, 1.8);

      let started = false;
      const start = () => {
        if (started) return;
        started = true;
        window.dispatchEvent(new Event(INTRO_EVENT));
        tl.play();
      };

      // Begin once frames can actually play, so the reveal shows the image rather than a
      // black box. On a slow network or with autoplay blocked, the poster carries the shot.
      if (video.readyState >= 3) start();
      video.addEventListener("canplay", start, { once: true });
      const fallback = window.setTimeout(start, 2400);

      return () => {
        video.removeEventListener("canplay", start);
        window.clearTimeout(fallback);
      };
    });

    // Reduced motion: a still frame in a dark room. Visible states resolve in globals.css.
    mm.add("(prefers-reduced-motion: reduce)", () => {
      video.removeAttribute("autoplay");
      video.pause();
    });

    // ---- Leaving the hero ----------------------------------------------------
    // The section is sticky, so it holds while the panel underneath rides up over it
    // at full scroll speed. Nothing fades and nothing closes: the frame is simply
    // covered, edge hard, like a wipe. Inside it, two planes drift at different
    // rates over that same viewport of scroll — the image slowest, the type a little
    // ahead of it — which is the only depth in the move.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({
          defaults: { ease: "none", duration: 1 },
          scrollTrigger: {
            start: 0,
            end: () => window.innerHeight,
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        })
        // The media box is drawn 8% taller than the frame, so it can rise without
        // opening a gap at the bottom edge.
        .fromTo(media, { yPercent: 0, scale: 1 }, { yPercent: -6, scale: 1.04 }, 0)
        .fromTo(fore, { yPercent: 0 }, { yPercent: -11 }, 0);
    });

    // Once the panel has the frame fully covered, stop paying for it.
    mm.add("all", () => {
      ScrollTrigger.create({
        start: () => window.innerHeight,
        end: "max",
        invalidateOnRefresh: true,
        onToggle: (self) => {
          section.classList.toggle("is-covered", self.isActive);
          if (self.isActive) video.pause();
          else if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            video.play().catch(() => {});
          }
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="hero">
      <div ref={mediaRef} className="hero-media">
        <video
          ref={videoRef}
          className="hero-video h-full w-full"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/video/hero/hero-alysano-poster.jpg"
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          disableRemotePlayback
        >
          <source
            src="/video/hero/hero-alysano-1080.mp4"
            type="video/mp4"
            media="(min-width: 768px)"
          />
          <source src="/video/hero/hero-alysano-720.mp4" type="video/mp4" />
        </video>
        <div className="hero-vignette pointer-events-none absolute inset-0" aria-hidden="true" />
      </div>

      {/* The foreground plane — showreel and headline travel together, ahead of the image. */}
      <div ref={foreRef} className="hero-fore">
        <Showreel />

        <div className="absolute inset-x-0 bottom-0 px-5 pb-6 md:px-10 md:pb-9">
          <h1 ref={headlineRef} className="hero-headline font-title uppercase text-ivory">
            {HEADLINE.map((line) => (
              <span key={line} data-line className="block">
                {line}
              </span>
            ))}
          </h1>
        </div>
      </div>
    </section>
  );
}
