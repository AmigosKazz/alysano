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
  const videoRef = useRef<HTMLVideoElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    const video = videoRef.current;
    const headline = headlineRef.current;
    if (!section || !media || !video || !headline) return;

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

    // ---- Scroll --------------------------------------------------------------
    mm.add(
      { desktop: "(min-width: 768px)", motion: "(prefers-reduced-motion: no-preference)" },
      (ctx) => {
        const { desktop, motion } = ctx.conditions ?? {};
        if (!motion) return;

        if (desktop) {
          // Pinned for one viewport of scroll: the image pushes in and dims, the headline slips
          // upward, then the frame closes like a letterbox onto the section already waiting underneath.
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => "+=" + section.offsetHeight,
                scrub: 0.6,
                pin: true,
                pinSpacing: false,
                anticipatePin: 1,
              },
            })
            // Durations are fractions of the pinned scroll distance (1 = the full viewport of scroll).
            .to(media, { scale: 1.1, duration: 1 }, 0)
            .to(media, { opacity: 0.3, duration: 0.7, ease: "power1.in" }, 0.3)
            .to(headline, { y: -32, opacity: 0, duration: 0.55, ease: "power1.in" }, 0)
            .to(meta(), { opacity: 0, duration: 0.3 }, 0)
            .fromTo(
              section,
              { clipPath: "inset(0% 0% 0% 0%)" },
              { clipPath: "inset(40% 0% 60% 0%)", duration: 1, ease: "power1.in" },
              0,
            );
          return;
        }

        // Mobile: no pin, a lighter touch. The image pushes in and dims as the section scrolls off.
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 0.6 },
          })
          .to(media, { scale: 1.06, opacity: 0.35, duration: 1 }, 0)
          .to(headline, { y: -24, opacity: 0, duration: 0.5 }, 0)
          .to(meta(), { opacity: 0, duration: 0.35 }, 0);
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="hero">
      <div ref={mediaRef} className="absolute inset-0 will-change-transform">
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

      <Showreel />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 px-5 pb-6 md:px-10 md:pb-9">
        <h1 ref={headlineRef} className="hero-headline font-title uppercase text-ivory">
          {HEADLINE.map((line) => (
            <span key={line} data-line className="block">
              {line}
            </span>
          ))}
        </h1>
      </div>
    </section>
  );
}
