"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { INTRO_EVENT } from "@/lib/intro";

const PREVIEW = "/video/showreel/showreel-preview.mp4";
const FULL = "/video/showreel/showreel-1080.mp4";
const POSTER = "/video/showreel/showreel-poster.jpg";

/**
 * The showreel call sits in the empty right of the frame. Approaching it lifts a muted
 * preview behind the label; opening it expands that frame to fill the screen with sound.
 */
export function Showreel() {
  // Where the trigger sat when it was clicked: the frame grows from there. Holding the rect
  // rather than a ref keeps render pure, and leaves the portal unrendered on the server.
  const [origin, setOrigin] = useState<DOMRect | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);

  // The preview runs from the start, but only once the opening sequence has fired — the
  // hero video gets the bandwidth it needs first.
  useEffect(() => {
    const video = previewRef.current;
    if (!video) return;

    const play = () => video.play().catch(() => {});
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    window.addEventListener(INTRO_EVENT, play, { once: true });
    const fallback = window.setTimeout(play, 2600);
    return () => {
      window.removeEventListener(INTRO_EVENT, play);
      window.clearTimeout(fallback);
    };
  }, []);

  const close = useCallback(() => {
    setOrigin(null);
    triggerRef.current?.focus();
  }, []);

  return (
    <div className="showreel" data-intro>
      <button
        ref={triggerRef}
        type="button"
        className="showreel-trigger"
        data-cursor="Play"
        aria-label="Play showreel"
        onClick={(event) => setOrigin(event.currentTarget.getBoundingClientRect())}
      >
        <span className="showreel-preview" aria-hidden="true">
          <video
            ref={previewRef}
            src={PREVIEW}
            muted
            loop
            playsInline
            preload="metadata"
            poster={POSTER}
            tabIndex={-1}
            disablePictureInPicture
            disableRemotePlayback
          />
        </span>
        <span className="showreel-meta" aria-hidden="true">
          <span className="showreel-label font-mono">
            <span>Showreel</span>
            <svg width="7" height="8" viewBox="0 0 7 8" fill="currentColor" aria-hidden="true">
              <path d="M0 0v8l7-4z" />
            </svg>
          </span>
          <span className="showreel-rule" />
        </span>
      </button>

      {origin ? createPortal(<Player origin={origin} onClose={close} />, document.body) : null}
    </div>
  );
}

function Player({ origin, onClose }: { origin: DOMRect; onClose: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [paused, setPaused] = useState(false);

  // Open: the frame grows from wherever the trigger sits, rather than fading in from nowhere.
  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;

    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rect = origin;
    const { innerWidth: vw, innerHeight: vh } = window;

    if (reduced) {
      gsap.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    } else {
      const from = `inset(${(rect.top / vh) * 100}% ${((vw - rect.right) / vw) * 100}% ${
        ((vh - rect.bottom) / vh) * 100
      }% ${(rect.left / vw) * 100}%)`;
      gsap.fromTo(
        root,
        { clipPath: from },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.inOut" },
      );
      gsap.fromTo(video, { scale: 1.08 }, { scale: 1, duration: 1.2, ease: "power3.out" });
    }

    video.play().catch(() => {});

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [origin]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Progress readout, written straight to the style to stay off the React render path.
  useEffect(() => {
    const video = videoRef.current;
    const bar = barRef.current;
    if (!video || !bar) return;
    let raf = 0;
    const tick = () => {
      if (video.duration) bar.style.transform = `scaleX(${video.currentTime / video.duration})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setPaused(false);
    } else {
      video.pause();
      setPaused(true);
    }
  };

  return (
    <div
      ref={rootRef}
      className="showreel-player"
      role="dialog"
      aria-modal="true"
      aria-label="Showreel"
    >
      <video
        ref={videoRef}
        className="showreel-player-video"
        src={FULL}
        poster={POSTER}
        playsInline
        autoPlay
        onClick={toggle}
        onEnded={onClose}
      />

      <button type="button" className="showreel-player-toggle font-mono" onClick={toggle}>
        {paused ? "Play" : "Pause"}
      </button>

      <button ref={closeRef} type="button" className="showreel-close font-mono" onClick={onClose}>
        Close
        <span aria-hidden="true">✕</span>
      </button>

      <span className="showreel-progress" aria-hidden="true">
        <span ref={barRef} />
      </span>
    </div>
  );
}
