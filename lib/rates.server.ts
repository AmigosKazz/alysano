import "server-only";

import { formatPrice, type Discount, type Price, type Prices } from "./money";
import type { CatalogueId, PackId, RowKey, StepKey, StudyStepKey } from "./services";

/**
 * Every figure on the site, and the only place one is written.
 *
 * Two guards keep it that way:
 *
 * - `server-only` makes it a build error to import this file from a client
 *   component, so no figure can reach a bundle — whatever tree-shaking does.
 * - The tables are typed against `lib/services`: a row left without its rates,
 *   or a rate given for a row the catalogue does not have, does not compile.
 *
 * What reaches a page is only what the page hands on. Rate cards travel to the
 * browser one catalogue at a time, as props of the table that shows them.
 */

/** Shorthand so the tables below stay readable at a glance. */
const ar = (amount: number, from = false): Price => ({ kind: "amount", ar: amount, from });
const QUOTE: Price = { kind: "quote" };
const NONE: Price = { kind: "none" };

const percent = (off: number): Discount => ({ kind: "percent", off });
const UNIT: Discount = { kind: "unit" };
const ON_QUOTE: Discount = { kind: "quote" };

/* ------------------------------------------------------------------ */
/* Rate cards                                                          */
/* ------------------------------------------------------------------ */

const RATE_CARDS: { [C in CatalogueId]: Record<RowKey<C>, Prices> } = {
  /* ---- Shooting & direction of photography ---- */
  events: {
    light: [ar(300_000), ar(400_000), QUOTE],
    standard: [ar(500_000), ar(600_000), QUOTE],
    club: [ar(600_000), ar(800_000), QUOTE],
    concert: [ar(700_000), ar(1_000_000), QUOTE],
    full: [ar(800_000), ar(1_100_000), QUOTE],
  },

  "music-video-dop": {
    "half-day": [ar(600_000), ar(700_000), QUOTE],
    "full-day": [ar(900_000), ar(1_000_000), QUOTE],
    ambitious: [NONE, QUOTE, QUOTE],
  },

  "commercial-dop": {
    "digital-spot": [ar(600_000), ar(700_000), QUOTE],
    commercial: [ar(900_000), ar(1_200_000), QUOTE],
    campaign: [NONE, QUOTE, QUOTE],
  },

  "narrative-dop": {
    "short-film": [ar(700_000), ar(1_000_000), QUOTE],
  },

  "short-form-dop": {
    reel: [ar(250_000), ar(350_000), QUOTE],
    pack: [ar(400_000), ar(500_000), QUOTE],
  },

  /* ---- Shared: appears under Directing and under Full visual production ---- */
  "full-production": {
    "music-video": [ar(1_500_000, true), ar(2_500_000, true), QUOTE],
    spot: [ar(2_000_000, true), ar(3_500_000, true), QUOTE],
    "brand-film": [ar(2_000_000, true), ar(3_500_000, true), QUOTE],
    corporate: [ar(1_500_000, true), ar(2_500_000, true), QUOTE],
    "social-campaign": [ar(2_000_000, true), ar(3_500_000, true), QUOTE],
  },

  /* ---- Shared: appears under Directing and under Full visual production ---- */
  "short-video": {
    "15-30s": [ar(350_000, true), ar(550_000, true), QUOTE],
    "30-60s": [ar(450_000, true), ar(700_000, true), QUOTE],
    "1-2min": [ar(600_000, true), ar(900_000, true), QUOTE],
    "2-3min": [ar(750_000, true), ar(1_100_000, true), QUOTE],
    "3-5min": [ar(900_000, true), ar(1_300_000, true), QUOTE],
  },

  /* ---- Post-production ---- */
  editing: {
    reel: [ar(150_000), ar(250_000), ar(400_000, true)],
    short: [ar(200_000), ar(350_000), ar(500_000, true)],
    "youtube-10": [ar(300_000), ar(500_000), ar(750_000, true)],
    "youtube-20": [ar(450_000), ar(700_000), ar(1_000_000, true)],
    interview: [ar(250_000), ar(450_000), ar(700_000, true)],
    corporate: [ar(400_000), ar(650_000), ar(1_000_000, true)],
    commercial: [ar(600_000), ar(900_000), ar(1_500_000, true)],
    "music-video": [ar(600_000), ar(900_000), ar(1_500_000, true)],
    "short-film-5": [ar(600_000), ar(900_000), ar(1_500_000, true)],
    "short-film-15": [ar(900_000), ar(1_300_000), ar(2_000_000, true)],
    documentary: [ar(700_000), ar(1_100_000), ar(1_800_000, true)],
  },

  "sound-design": {
    cleanup: [ar(100_000), ar(200_000), ar(350_000, true)],
    "design-1": [ar(150_000), ar(250_000), ar(400_000, true)],
    "design-3": [ar(200_000), ar(350_000), ar(550_000, true)],
    "design-5": [ar(300_000), ar(500_000), ar(750_000, true)],
    "design-10": [ar(450_000), ar(700_000), ar(1_000_000, true)],
    cinematic: [ar(500_000), ar(800_000), ar(1_200_000, true)],
  },
};

/* ------------------------------------------------------------------ */
/* Volume                                                              */
/* ------------------------------------------------------------------ */

const DISCOUNTS: { [P in PackId]: Record<StepKey<P>, Discount> } = {
  shoots: { "3": percent(5), "5": percent(8), "10": percent(12), recurring: ON_QUOTE },
  reels: { "1": UNIT, "5": percent(5), "10": percent(10), "20": percent(15), "30+": ON_QUOTE },
  clips: { "1": UNIT, "2": percent(5), "3": percent(8), "5": percent(12), "5+": ON_QUOTE },
  episodes: {
    "1": UNIT,
    "3": percent(5),
    "5": percent(8),
    "8": percent(12),
    "10": percent(15),
    "10+": ON_QUOTE,
  },
};

/* ------------------------------------------------------------------ */
/* The path to a quote — the one paid step on it                       */
/* ------------------------------------------------------------------ */

const STUDY_FEES: Record<StudyStepKey, string> = {
  brief: "—",
  script: formatPrice(ar(100_000)),
  preparation: "Per quote",
  quote: "Included in the study",
};

/* ------------------------------------------------------------------ */
/* The way out                                                         */
/* ------------------------------------------------------------------ */

export type Rates = {
  catalogues: Readonly<Record<CatalogueId, Readonly<Record<string, Prices>>>>;
  packs: Readonly<Record<PackId, Readonly<Record<string, Discount>>>>;
  study: Readonly<Record<string, string>>;
};

/** The one door to the figures — every read of a rate goes through here. */
export function getRates(): Rates {
  return { catalogues: RATE_CARDS, packs: DISCOUNTS, study: STUDY_FEES };
}
