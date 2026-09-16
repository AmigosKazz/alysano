# ALY SANOO — Creative Portfolio

## Overview

Build a premium cinematic portfolio website for **ALY SANOO**, a video editor, post-production artist and director.

The website should feel like a **digital film studio / editorial portfolio**, not a generic freelancer website.

The visual reference is closer to:

* A24
* Artlist
* Film production studios
* High-end editorial websites
* Award-winning creative developer portfolios
* Contemporary post-production studios
* Minimal Swiss/editorial web design

The goal is to create a website that feels **intentional, cinematic, restrained and art-directed**.

It must NOT look AI-generated, template-based, or like a typical developer portfolio.

---

# Creative Direction

## Core idea

The website should communicate:

> **The edit is where the image becomes a story.**

ALY SANOO is not presented simply as someone who "edits videos".

He should be positioned as someone working between:

* Editing
* Post-production
* Direction
* Visual storytelling
* Rhythm
* Image
* Sound
* Atmosphere

The website should therefore feel like entering a **private screening room**.

---

# Visual Identity

## Mood

Dark.

Cinematic.

Quiet.

Precise.

Editorial.

Human.

Slightly mysterious.

The design should create curiosity rather than immediately explaining everything.

Think:

**dark cinema + contemporary editorial design + post-production interface.**

---

# Color System

Use a restrained palette.

### Background

```css
--black: #080A0C;
```

Very dark blue-black.

Do not use pure `#000000` everywhere.

### Primary text

```css
--ivory: #E8E6E1;
```

Use instead of pure white.

### Secondary text

```css
--muted: #7D858C;
```

### Cinematic blue

```css
--steel-blue: #8FA9B8;
```

Use extremely sparingly.

### Optional warm accent

```css
--warm-gray: #B9A58A;
```

Only for tiny details if necessary.

The interface should remain approximately:

**90% dark / 8% neutral / 2% accent.**

---

# Typography

Typography is one of the most important elements.

Avoid generic startup typography.

## Display

Preferred:

* Söhne
* Neue Haas Grotesk
* Suisse Int'l
* Helvetica Neue
* Instrument Sans

The main typography should be clean, modern and slightly editorial.

Use large typography carefully.

Do NOT create huge text simply because the website is a portfolio.

Typography should create composition.

## Technical metadata

Use a monospaced font such as:

* Geist Mono
* IBM Plex Mono
* SF Mono

For:

* project numbers
* dates
* duration
* role
* navigation metadata
* cursor labels
* small technical information

---

# Layout

Use a strong editorial grid.

Avoid conventional centered layouts.

Use:

* asymmetrical compositions
* large negative space
* horizontal rules
* tiny metadata
* oversized but controlled typography
* full-bleed media
* overlapping elements
* viewport-based positioning

The layout should feel designed rather than component-generated.

---

# Navigation

Navigation should be minimal.

Suggested structure:

```text
ALY SANOO

WORK
ABOUT
CONTACT

[AVAILABLE FOR SELECT PROJECTS]
```

The navbar should initially feel integrated into the hero.

Transparent background.

No obvious border.

No heavy navbar container.

On scroll:

* subtle background change
* slight blur if necessary
* remain minimal
* no exaggerated sticky animation

Navigation animation should be subtle.

---

# Cursor

Desktop experience may use a custom cursor.

Default:

small circular point.

When hovering over a project:

```text
VIEW
```

or

```text
PLAY
```

The cursor can expand slightly.

Do not make the cursor huge or gimmicky.

Magnetic interactions should be subtle.

---

# Motion Philosophy

GSAP should be used for art direction, not decoration.

Animation should feel:

**slow + deliberate + physical.**

Avoid:

* excessive fade-up animations
* random stagger everywhere
* bouncing elements
* exaggerated scale
* unnecessary parallax
* scroll hijacking
* excessive blur animations

Prefer:

* clip-path reveals
* masked image reveals
* horizontal movement
* subtle scale
* opacity transitions
* text displacement
* image cropping
* timeline-based transitions
* smooth easing

Recommended easing:

```js
power3.out
power4.out
expo.out
```

Use long durations when appropriate.

---

# Hero

The hero is the most important part of the website.

A supplied cinematic video should be used as the main visual material.

The video contains:

* dark environment
* cold blue lighting
* a human silhouette
* vertical light
* blur
* atmospheric transitions

Do not cover the video with excessive UI.

The hero should feel almost like the opening shot of a film.

Detailed hero implementation instructions are provided separately.

---

# Content Architecture

The website should eventually contain:

## 01 — Hero

Introduction to ALY SANOO.

Minimal positioning.

Cinematic video.

---

## 02 — Selected Work

A curated selection of projects.

Not a generic grid.

Projects should feel like individual film pieces.

Possible project metadata:

```text
01
TITLE
CLIENT
YEAR
ROLE
EDITORIAL / COMMERCIAL / MUSIC / FILM
```

Hovering a project should activate a cinematic preview.

---

## 03 — Statement

A short manifesto about editing and storytelling.

Keep it concise.

Example conceptual direction:

> Images are captured.
> Stories are shaped in the edit.

Do not over-explain.

---

## 04 — About

Introduce ALY SANOO as:

**Editor / Director**

Explain his approach to:

* rhythm
* storytelling
* visual language
* collaboration
* post-production

Keep the copy human and concise.

---

## 05 — Services

Possible categories:

### EDITING

Narrative structure, rhythm, pacing and storytelling.

### POST-PRODUCTION

Finishing, visual treatment and final image refinement.

### DIRECTION

Visual development and creative direction.

### COMMERCIAL

Brand films, campaigns and visual content.

Avoid turning this section into a corporate service list.

---

## 06 — Selected Clients

Only if real clients are available.

Use typography rather than logo-wall overload.

---

## 07 — Contact

The final section should feel like an invitation to start a project.

Possible direction:

```text
HAVE A STORY
TO CUT?

LET'S TALK →
```

Keep it extremely minimal.

---

# Project Interaction

Each project should eventually open into a cinematic project page.

Possible structure:

```text
PROJECT TITLE

YEAR
CLIENT
ROLE

[HERO VIDEO]

DESCRIPTION

[SELECTED STILLS]

PROCESS / CREDITS

NEXT PROJECT →
```

The project page should feel like a film case study.

---

# Technical Direction

Recommended stack:

* Next.js
* React
* TypeScript
* Tailwind CSS
* GSAP
* Lenis or another lightweight smooth-scroll solution
* HTML5 video
* modern image optimization

Do not introduce unnecessary libraries.

Prefer custom implementation.

---

# Performance

The site is media-heavy.

Performance is important.

Implement:

* poster images
* lazy loading
* optimized video
* responsive video sources
* `playsInline`
* `muted`
* `loop`
* preload strategy
* proper image sizes
* GPU-friendly transforms

Avoid unnecessarily animating:

```css
width
height
top
left
margin
```

Prefer:

```css
transform
opacity
clip-path
```

---

# Responsive Design

Desktop should be the primary art-directed experience.

But mobile must remain premium.

Do not simply stack desktop components vertically.

Recompose the layout for mobile.

The cinematic video should remain prominent.

Typography must remain intentional.

Avoid excessive UI density.

---

# Design Rules

## DO

* use negative space
* use cinematic imagery
* use subtle blue tones
* use editorial typography
* use technical metadata
* use asymmetry
* use controlled GSAP transitions
* use full-screen media
* use precise spacing
* create moments of silence

## DON'T

* use purple gradients
* use neon gradients
* use glassmorphism
* use excessive rounded cards
* use generic SaaS layouts
* use excessive shadows
* use stock imagery
* use fake testimonials
* use meaningless statistics
* use giant "VIDEO EDITOR" text everywhere
* animate every element
* create unnecessary sections
* make the site look like an AI-generated template

---

# Overall Experience

The website should feel like:

> **A film before the film begins.**

The visitor should feel that ALY SANOO cares about:

**image, rhythm, silence, composition and storytelling.**

Every interaction should reinforce that idea.

The website should be **minimal in UI but rich in atmosphere.**
