"use client";

import { Fragment, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cta } from "@/components/ui/Cta";

const MENU = ["Cut", "Copy", "Collaborate", "Share…"];

const FACTS = [
  "Based in Antananarivo, Madagascar",
  "Working with crews and labels across Europe and Africa",
  "Available for select projects",
];

const DISCIPLINES = [
  {
    title: "Direction",
    line: "The intention a piece is shot with — what it is about before it is about anything else.",
    items: ["Treatment", "Shot design", "Casting eye", "On-set direction"],
  },
  {
    title: "Post-production",
    line: "Edit, grade, sound and finish worked as a single pass, not a relay of departments.",
    items: ["Edit", "Colour", "Sound design", "Master & delivery"],
  },
  {
    title: "Production design",
    line: "What stands in front of the lens: space, surface, prop and light, decided early.",
    items: ["Set design", "Props", "Styling", "Lighting mood"],
  },
];

const STATEMENT_A = "Where others hand over clean footage";
const STATEMENT_B = "I hand over the film it was shot for.";

/** Splits a line into word wrappers so each one can be masked or lit on its own. */
function Words({ text, mask }: { text: string; mask?: boolean }) {
  return text.split(" ").map((word, i) => (
    <Fragment key={`${word}-${i}`}>
      <span className={mask ? "about-stage-word" : undefined} data-word>
        <span>{word}</span>
      </span>{" "}
    </Fragment>
  ));
}

/**
 * The long form of the About section. Two full-screen movements built on the same
 * frame — title against the left edge, the picture holding the middle, the reading
 * column pinned to the right margin — with the credit line riding over both as a
 * selected clip. After them the statement, lit word by word on the scroll.
 */
export function AboutStage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(root);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("[data-movement]", root).forEach((block) => {
        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: block, start: "top 72%" },
        });

        const words = block.querySelectorAll<HTMLElement>(".about-stage-word > span");
        if (words.length) {
          // `y: 0` is held on both ends: the CSS opening state is a percentage
          // translate, which GSAP would otherwise read back as absolute pixels.
          tl.fromTo(
            words,
            { yPercent: 108, y: 0 },
            { yPercent: 0, y: 0, duration: 1.3, stagger: 0.035 },
            0,
          );
        }

        const frame = block.querySelector("[data-frame]");
        if (frame) {
          tl.fromTo(
            frame,
            { clipPath: "inset(0% 0% 100% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power3.out" },
            0.1,
          );
        }

        const fades = block.querySelectorAll("[data-fade]");
        if (fades.length) {
          tl.fromTo(
            fades,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 1.1, stagger: 0.1, ease: "power3.out" },
            0.35,
          );
        }
      });

      // The credit line arrives once, with the opening frame, and then rides along.
      gsap.fromTo(
        "[data-badge]",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 1, delay: 0.6, ease: "power3.out" },
      );

      // It leaves the moment the second frame rises into its line, rather than
      // sitting on top of the picture.
      const second = root.querySelector(".about-m2-figure");
      if (second) {
        gsap.to("[data-badge]", {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: second,
            start: "top 34%",
            toggleActions: "play none none reverse",
          },
        });
      }

      // The photographs drift inside their frames for as long as they are in view.
      gsap.utils.toArray<HTMLElement>("[data-photo]", root).forEach((photo) => {
        gsap.fromTo(
          photo,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: photo.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          },
        );
      });

      // The statement is lit rather than moved: each word crosses from muted to
      // ivory as the scroll passes it, so reading speed sets the pace.
      gsap.utils.toArray<HTMLElement>("[data-lit]", root).forEach((line) => {
        gsap.fromTo(
          line.querySelectorAll("[data-word] > span"),
          { color: "rgba(125, 133, 140, 0.55)" },
          {
            color: "#E8E6E1",
            ease: "none",
            stagger: 0.5,
            scrollTrigger: {
              trigger: line,
              start: "top 85%",
              end: "bottom 55%",
              scrub: 0.4,
            },
          },
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef} className="about-stage">
      {/* The two movements share one pinned credit, so it has to share their box. */}
      <div className="about-reel">
        <div className="about-pin">
          <div data-badge className="about-badge">
            {/* The menu an editor lives in, sitting where the film's credit would. */}
            <div className="about-menu" aria-hidden>
              {MENU.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <p className="about-credit font-title">
              <span className="about-credit-mark" aria-hidden />
              <span className="about-credit-text">
                “Directed, cut and finished by Aly Sanoo”
              </span>
              <span className="about-credit-mark about-credit-mark--end" aria-hidden />
            </p>
          </div>
        </div>

        {/* ------------------------------ opening ------------------------------ */}
        <section data-movement className="about-m1">
          <figure data-frame className="about-m1-figure">
            <div data-photo className="about-photo">
              <Image
                src="/images/about/about-wide.jpg"
                alt="Aly Sanoo in profile against a pool of cold light"
                fill
                priority
                sizes="(min-width: 900px) 68vw, 100vw"
              />
            </div>

            {/* Two lines: one would run under the credit that hangs beside it. */}
            <h1 className="about-m1-title font-title">
              <span className="about-m1-line">
                <Words text="Direction &" mask />
              </span>
              <span className="about-m1-line">
                <Words text="Post-production" mask />
              </span>
            </h1>
          </figure>

          <div className="about-side">
            <ul data-fade className="about-facts">
              {FACTS.map((fact) => (
                <li key={fact}>
                  <span aria-hidden>[</span>
                  {fact}
                </li>
              ))}
            </ul>

            <p data-fade className="about-copy">
              Aly Sanoo directs, cuts and finishes film. He works the whole length of a
              piece — the intention it is shot with, the world built in front of the
              lens, and the long stretch afterwards where footage is turned into
              narrative, image and sound. Music videos, brand films, documentary and
              fiction, made with small crews for people who care what the thing feels
              like at the end.
            </p>
          </div>
        </section>

        {/* ------------------------------ the frame ------------------------------ */}
        <section data-movement className="about-m2">
          <h2 className="about-m2-title font-title">
            <Words text="Production design" mask />
          </h2>

          <figure data-frame className="about-m2-figure">
            <div data-photo className="about-photo">
              <Image
                src="/images/about/about-portrait.jpg"
                alt="Aly Sanoo lit by a single vertical strip of light"
                fill
                sizes="(min-width: 900px) 40vw, 100vw"
              />
            </div>
          </figure>

          <blockquote className="about-quote">
            <p data-fade>
              “Before a frame is shot I want to know what it has to feel like. The
              space, the surface, the one prop that carries the scene, the way light
              falls across it — those are story decisions, not decoration. Build the
              world right and the edit has something to cut with. Build it loosely and
              no amount of post will save the film.”
            </p>
            <footer data-fade className="about-attribution">
              — Aly Sanoo
            </footer>
          </blockquote>
        </section>
      </div>

      {/* ------------------------------ statement ------------------------------ */}
      <section data-movement className="about-stage-statement">
        <p data-lit className="about-stage-loud font-title">
          <Words text={STATEMENT_A} />
        </p>

        <div className="about-stage-notes">
          <p data-fade className="about-stage-note about-stage-note--left">
            A film is not a folder of shots. It is a decision about what the audience
            feels, and when.
          </p>
          <div className="about-stage-note about-stage-note--right">
            <p data-fade>
              Edit, grade and sound are one pass here. Separating them is how a piece
              ends up correct and cold.
            </p>
            <p data-fade className="about-stage-note-strong">
              Every cut is a choice about attention.
            </p>
          </div>
        </div>

        <p data-lit className="about-stage-loud about-stage-loud--end font-title">
          <Words text={STATEMENT_B} />
        </p>
      </section>

      {/* ------------------------------ disciplines ------------------------------ */}
      <section data-movement className="about-stage-disciplines">
        <h2 data-fade className="about-stage-kicker font-mono">
          <span aria-hidden>[</span>What that covers
        </h2>

        <ul className="about-stage-list">
          {DISCIPLINES.map((discipline) => (
            <li key={discipline.title} data-fade className="about-stage-discipline">
              <h3 className="about-stage-discipline-title font-title">
                {discipline.title}
              </h3>
              <p className="about-stage-discipline-line">{discipline.line}</p>
              <ul className="about-stage-discipline-items font-mono">
                {discipline.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <span data-fade className="about-stage-action">
          <Cta href="/contact" label="Start a project" />
        </span>
      </section>
    </div>
  );
}
