/**
 * The one catalogue. Every services page reads from here, so a rate is changed
 * in a single place and the site follows.
 *
 * Two rules hold the whole file together:
 *
 * 1. A price is a value, never a string. The source documents wrote the same
 *    idea five ways ("300k", "1.5M Ar+", "350K+", "Sur devis", "—"); here it is
 *    one shape and one formatter, so the page decides how it reads.
 *
 * 2. A catalogue is referenced, never copied. Three tables appeared twice
 *    across the source documents — full production, short video, and the
 *    quote-only list. They are defined once below and pointed at by id from
 *    both categories that show them, which makes drift impossible.
 *
 * TODO: the fifteen conditions are contractual wording translated from the
 * French originals. Aly should read them before this goes live.
 */

/* ------------------------------------------------------------------ */
/* Money                                                               */
/* ------------------------------------------------------------------ */

export type Price =
  /** `from` marks the rates the documents wrote with a trailing "+". */
  | { kind: "amount"; ar: number; from?: boolean }
  | { kind: "quote" }
  | { kind: "none" };

/** Shorthand so the tables below stay readable at a glance. */
const ar = (amount: number, from = false): Price => ({ kind: "amount", ar: amount, from });
const QUOTE: Price = { kind: "quote" };
const NONE: Price = { kind: "none" };

/**
 * Ariary, grouped in threes and cut to millions past a million — the way the
 * source documents read them. `from` is carried by the page, not the number,
 * so "from" can be said once for a whole column rather than on every cell.
 */
export function formatPrice(price: Price): string {
  if (price.kind === "quote") return "On request";
  if (price.kind === "none") return "—";

  const { ar: amount } = price;
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    const written = Number.isInteger(millions) ? String(millions) : millions.toFixed(1);
    return `${written} M Ar`;
  }
  return `${amount.toLocaleString("en-US").replace(/,/g, " ")} Ar`;
}

/* ------------------------------------------------------------------ */
/* Catalogues                                                          */
/* ------------------------------------------------------------------ */

export type Row = {
  label: string;
  /** Long tables are grouped so the eye has landmarks — see `editing`. */
  group?: string;
  prices: [Price, Price, Price];
};

export type Catalogue = {
  id: string;
  title: string;
  /** Kept per catalogue: the source used three different namings for the same
   *  three levels, and flattening them would lose the client's own vocabulary. */
  tiers: [string, string, string];
  /** Which tier the studio puts forward. Index into `tiers`. */
  recommended?: 0 | 1 | 2;
  note?: string;
  rows: Row[];
  /** Rows that carry no grid information — every tier is "on request". Pulled
   *  out of the table so the matrix stays worth reading. */
  onRequest?: string[];
};

const DOP_TIERS: [string, string, string] = ["Starting", "Signature", "Premium"];
const STUDIO_TIERS: [string, string, string] = ["Essential", "Signature", "Premium"];
const POST_TIERS: [string, string, string] = ["Starting", "Recommended", "Premium"];

export const CATALOGUES: Record<string, Catalogue> = {
  /* ---- Shooting & direction of photography ---- */
  events: {
    id: "events",
    title: "Events",
    tiers: DOP_TIERS,
    recommended: 1,
    rows: [
      { label: "Event Light", prices: [ar(300_000), ar(400_000), QUOTE] },
      { label: "Event Standard", prices: [ar(500_000), ar(600_000), QUOTE] },
      { label: "DJ / Night club", prices: [ar(600_000), ar(800_000), QUOTE] },
      { label: "Concert / Live event", prices: [ar(700_000), ar(1_000_000), QUOTE] },
      { label: "Full event coverage", prices: [ar(800_000), ar(1_100_000), QUOTE] },
    ],
  },

  "music-video-dop": {
    id: "music-video-dop",
    title: "Music videos",
    tiers: DOP_TIERS,
    recommended: 1,
    rows: [
      { label: "Half day (up to 5h)", prices: [ar(600_000), ar(700_000), QUOTE] },
      { label: "Full day (up to 10h)", prices: [ar(900_000), ar(1_000_000), QUOTE] },
      { label: "Ambitious project", prices: [NONE, QUOTE, QUOTE] },
    ],
  },

  "commercial-dop": {
    id: "commercial-dop",
    title: "Advertising & brand",
    tiers: DOP_TIERS,
    recommended: 1,
    rows: [
      { label: "Digital spot", prices: [ar(600_000), ar(700_000), QUOTE] },
      { label: "Advertising / Commercial", prices: [ar(900_000), ar(1_200_000), QUOTE] },
      { label: "Campaign / Multi-day", prices: [NONE, QUOTE, QUOTE] },
    ],
  },

  "narrative-dop": {
    id: "narrative-dop",
    title: "Film & narrative",
    tiers: DOP_TIERS,
    recommended: 1,
    rows: [{ label: "Short film", prices: [ar(700_000), ar(1_000_000), QUOTE] }],
    onRequest: ["Feature film", "Documentary"],
  },

  "short-form-dop": {
    id: "short-form-dop",
    title: "Short-form content",
    tiers: DOP_TIERS,
    recommended: 1,
    rows: [
      { label: "Reels / TikTok / Instagram (up to 1 min)", prices: [ar(250_000), ar(350_000), QUOTE] },
      { label: "Content pack (several videos)", prices: [ar(400_000), ar(500_000), QUOTE] },
    ],
  },

  /* ---- Shared: appears under Directing and under Full visual production ---- */
  "full-production": {
    id: "full-production",
    title: "Full production",
    tiers: STUDIO_TIERS,
    recommended: 1,
    note: "Concept, crew, equipment and supervision — from first decision to master.",
    rows: [
      { label: "Music video", prices: [ar(1_500_000, true), ar(2_500_000, true), QUOTE] },
      { label: "Advertising / Spot", prices: [ar(2_000_000, true), ar(3_500_000, true), QUOTE] },
      { label: "Brand film", prices: [ar(2_000_000, true), ar(3_500_000, true), QUOTE] },
      { label: "Corporate / Institutional", prices: [ar(1_500_000, true), ar(2_500_000, true), QUOTE] },
      { label: "Social media campaign", prices: [ar(2_000_000, true), ar(3_500_000, true), QUOTE] },
    ],
    onRequest: ["Short film / Narrative", "Documentary", "Series / Episodes"],
  },

  /* ---- Shared: appears under Directing and under Full visual production ---- */
  "short-video": {
    id: "short-video",
    title: "Short video, end to end",
    tiers: STUDIO_TIERS,
    recommended: 1,
    note: "Shoot, edit and finish in one pass.",
    rows: [
      { label: "15–30 sec", prices: [ar(350_000, true), ar(550_000, true), QUOTE] },
      { label: "30–60 sec", prices: [ar(450_000, true), ar(700_000, true), QUOTE] },
      { label: "1–2 min", prices: [ar(600_000, true), ar(900_000, true), QUOTE] },
      { label: "2–3 min", prices: [ar(750_000, true), ar(1_100_000, true), QUOTE] },
      { label: "3–5 min", prices: [ar(900_000, true), ar(1_300_000, true), QUOTE] },
    ],
  },

  /* ---- Post-production ---- */
  editing: {
    id: "editing",
    title: "Editing",
    tiers: POST_TIERS,
    recommended: 1,
    rows: [
      { group: "Short form", label: "Short / Reel, up to 60s", prices: [ar(150_000), ar(250_000), ar(400_000, true)] },
      { group: "Short form", label: "Short, 1–3 min", prices: [ar(200_000), ar(350_000), ar(500_000, true)] },
      { group: "Long form", label: "YouTube / Vlog, 5–10 min", prices: [ar(300_000), ar(500_000), ar(750_000, true)] },
      { group: "Long form", label: "YouTube / Vlog, 10–20 min", prices: [ar(450_000), ar(700_000), ar(1_000_000, true)] },
      { group: "Long form", label: "Interview / Podcast", prices: [ar(250_000), ar(450_000), ar(700_000, true)] },
      { group: "Brand & commercial", label: "Corporate / Brand", prices: [ar(400_000), ar(650_000), ar(1_000_000, true)] },
      { group: "Brand & commercial", label: "Advertisement / Commercial", prices: [ar(600_000), ar(900_000), ar(1_500_000, true)] },
      { group: "Brand & commercial", label: "Music video", prices: [ar(600_000), ar(900_000), ar(1_500_000, true)] },
      { group: "Narrative", label: "Narrative short film, up to 5 min", prices: [ar(600_000), ar(900_000), ar(1_500_000, true)] },
      { group: "Narrative", label: "Narrative short film, 5–15 min", prices: [ar(900_000), ar(1_300_000), ar(2_000_000, true)] },
      { group: "Narrative", label: "Documentary, up to 10 min", prices: [ar(700_000), ar(1_100_000), ar(1_800_000, true)] },
    ],
  },

  "sound-design": {
    id: "sound-design",
    title: "Sound design",
    tiers: POST_TIERS,
    recommended: 1,
    rows: [
      { label: "Sound editing / Cleanup", prices: [ar(100_000), ar(200_000), ar(350_000, true)] },
      { label: "Sound design, up to 1 min", prices: [ar(150_000), ar(250_000), ar(400_000, true)] },
      { label: "Sound design, 1–3 min", prices: [ar(200_000), ar(350_000), ar(550_000, true)] },
      { label: "Sound design, 3–5 min", prices: [ar(300_000), ar(500_000), ar(750_000, true)] },
      { label: "Sound design, 5–10 min", prices: [ar(450_000), ar(700_000), ar(1_000_000, true)] },
      { label: "Cinematic / Narrative", prices: [ar(500_000), ar(800_000), ar(1_200_000, true)] },
    ],
  },
};

/**
 * Shared: the same seven appeared under post-production and under full
 * production in the source. One list, pointed at from both.
 */
export const ON_REQUEST = [
  "Feature film",
  "Documentary",
  "Complex short film",
  "Series / Narrative series",
  "Large-scale commercial",
  "Full audio post-production",
  "Other complex productions",
] as const;

/* ------------------------------------------------------------------ */
/* Volume                                                              */
/* ------------------------------------------------------------------ */

export type Discount =
  | { kind: "percent"; off: number }
  /** The first step of a pack: no discount, the rate as listed. */
  | { kind: "unit" }
  | { kind: "quote" };

export type Pack = {
  id: string;
  title: string;
  note?: string;
  steps: { label: string; discount: Discount }[];
};

export const PACKS: Record<string, Pack> = {
  shoots: {
    id: "shoots",
    title: "Shoot packs",
    note: "Booked as one run.",
    steps: [
      { label: "3 shoots", discount: { kind: "percent", off: 5 } },
      { label: "5 shoots", discount: { kind: "percent", off: 8 } },
      { label: "10 shoots", discount: { kind: "percent", off: 12 } },
      { label: "Recurring production", discount: { kind: "quote" } },
    ],
  },
  reels: {
    id: "reels",
    title: "Reels",
    steps: [
      { label: "1 reel", discount: { kind: "unit" } },
      { label: "5 reels", discount: { kind: "percent", off: 5 } },
      { label: "10 reels", discount: { kind: "percent", off: 10 } },
      { label: "20 reels", discount: { kind: "percent", off: 15 } },
      { label: "30 and over", discount: { kind: "quote" } },
    ],
  },
  clips: {
    id: "clips",
    title: "Clips",
    steps: [
      { label: "1 clip", discount: { kind: "unit" } },
      { label: "2 clips", discount: { kind: "percent", off: 5 } },
      { label: "3 clips", discount: { kind: "percent", off: 8 } },
      { label: "5 clips", discount: { kind: "percent", off: 12 } },
      { label: "More than 5", discount: { kind: "quote" } },
    ],
  },
  episodes: {
    id: "episodes",
    title: "Episodes & series",
    steps: [
      { label: "1 episode", discount: { kind: "unit" } },
      { label: "3 episodes", discount: { kind: "percent", off: 5 } },
      { label: "5 episodes", discount: { kind: "percent", off: 8 } },
      { label: "8 episodes", discount: { kind: "percent", off: 12 } },
      { label: "10 episodes", discount: { kind: "percent", off: 15 } },
      { label: "More than 10", discount: { kind: "quote" } },
    ],
  },
};

export const formatDiscount = (discount: Discount): string =>
  discount.kind === "percent"
    ? `−${discount.off}%`
    : discount.kind === "unit"
      ? "Unit rate"
      : "On request";

/* ------------------------------------------------------------------ */
/* The path to a quote                                                 */
/* ------------------------------------------------------------------ */

export const PROJECT_STUDY = {
  fee: 100_000,
  line: "Settled once the brief is clear, before the script is read and the quote is prepared.",
  steps: [
    { label: "Brief", detail: "Objectives, references, constraints", fee: "—" },
    { label: "Script study", detail: "Reading the story and what it needs", fee: "100 000 Ar" },
    { label: "Preparation", detail: "Crew, equipment, production", fee: "Per quote" },
    { label: "Quote", detail: "A budget matched to the project", fee: "Included in the study" },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Production design — carried by the project, not by a rate card      */
/* ------------------------------------------------------------------ */

export const PRODUCTION_DESIGN = {
  /** What the shoot needs in front of the lens, and who carries it. */
  externals: [
    { label: "Extras / Actors", handling: "Client", note: "Per project" },
    { label: "Vehicles / Transport", handling: "Client", note: "Per project" },
    { label: "Locations", handling: "Client", note: "Per project" },
    { label: "Sets / Props", handling: "Client", note: "Per project" },
    { label: "Costumes / Styling", handling: "Client", note: "Per project" },
    { label: "Additional equipment", handling: "Per quote", note: "If required" },
    { label: "Accommodation / Travel", handling: "Per project", note: "If required" },
  ],
  /** What actually moves a budget, in the studio's own terms. */
  factors: [
    { label: "Creativity", detail: "Concept, art direction and visual research" },
    { label: "Crew", detail: "Number of people and level of specialisation" },
    { label: "Equipment", detail: "Camera, light, sound, grip and supporting gear" },
    { label: "Production", detail: "Preparation, shoot, coordination and supervision" },
  ],
  notes: [
    "Music video — extras, vehicles, locations, sets and additional locations are budgeted separately.",
    "Advertising / Spot — external production costs are set out in the quote.",
    "Brand film — locations, talent, vehicles, sets and other needs are budgeted separately.",
    "Social campaign — the number of deliverables, shoot days and requirements are set out in the quote.",
  ],
} as const;

/** What each tier covers on a short video, in the studio's own words. */
export const TIER_SCOPE = [
  { tier: "Essential", detail: "Light shoot · clean edit · basic colour" },
  { tier: "Signature", detail: "Crafted shoot · sound design · colour grading" },
  { tier: "Premium", detail: "Bespoke production · crew and resources to match" },
] as const;

/* ------------------------------------------------------------------ */
/* Terms — the same fifteen for every category                         */
/* ------------------------------------------------------------------ */

export const CONDITIONS = [
  { label: "Rates", detail: "Starting prices. The final quote follows the brief, duration, location, complexity and deliverables." },
  { label: "Payment", detail: "75% before production, 25% before final delivery." },
  { label: "Overtime", detail: "Billed separately beyond the agreed duration." },
  { label: "Schedule", detail: "A significant change means the quote is adjusted." },
  { label: "Rush", detail: "A surcharge of 25 to 50% depending on the deadline and the constraints." },
  { label: "Equipment", detail: "Supplied by the client or allowed for in the quote." },
  { label: "Travel", detail: "Travel, night transport, accommodation and logistics are added to the quote." },
  { label: "Crew", detail: "Additional crew is defined and budgeted per project." },
  { label: "Off catalogue", detail: "Work not covered here means a surcharge or a new quote." },
  { label: "Scope", detail: "Shooting only. Editing, grading, VFX and sound design are not included unless stated." },
  { label: "Revisions", detail: "Two rounds of revisions included on post-production work." },
  { label: "Rushes", detail: "An exceptional volume of footage means the quote is adjusted." },
  { label: "Deliverables", detail: "Additional versions, ratios and formats are billed separately." },
  { label: "Packs", detail: "Volume discounts apply to a confirmed volume. If the volume drops, it is recalculated at the unit rate." },
  { label: "Archiving", detail: "Long-term storage is agreed separately." },
] as const;

/* ------------------------------------------------------------------ */
/* The four disciplines                                                */
/* ------------------------------------------------------------------ */

export type Category = {
  slug: string;
  /** Reads the same as its line in the home section. */
  name: string;
  line: string;
  intro: string;
  /** What this covers, and what it does not — before any number is shown. */
  scope: { included: string[]; excluded: string[] };
  catalogueIds: string[];
  packIds: string[];
  /** The shared seven. */
  showOnRequest?: boolean;
};

export const CATEGORIES: Category[] = [
  {
    slug: "directing",
    name: "Directing",
    line: "Treatment. Shot design. Casting eye. On-set direction. Performance and blocking.",
    intro:
      "Behind the camera, or in front of the whole thing. Rates below are for the shoot itself; the last two tables carry a piece end to end.",
    scope: {
      included: ["Shot design and framing", "On-set direction", "Camera and lighting crew", "Rushes handed over"],
      excluded: ["Editing", "Colour grading", "Sound design", "VFX"],
    },
    catalogueIds: [
      "events",
      "music-video-dop",
      "commercial-dop",
      "narrative-dop",
      "short-form-dop",
      "full-production",
      "short-video",
    ],
    packIds: ["shoots"],
  },
  {
    slug: "post-production",
    name: "Post-production",
    line: "Edit. Structure. Rhythm and pacing. Colour. Sound design. Mix. Master and delivery.",
    intro:
      "Where the footage becomes the film. Rates are per finished piece, with two rounds of revisions included.",
    scope: {
      included: ["Edit and structure", "Colour", "Sound design and mix", "Master and delivery"],
      excluded: ["Shooting", "Crew and equipment", "Licensed music", "Long-term archiving"],
    },
    catalogueIds: ["editing", "sound-design"],
    packIds: ["reels", "clips", "episodes"],
    showOnRequest: true,
  },
  {
    slug: "production-design",
    name: "Production Design",
    line: "Set design. Props. Styling. Surface and texture. Lighting mood. Location dressing.",
    intro:
      "What stands in front of the lens. This one carries no rate card: it is built per project, and the elements below are budgeted in the quote rather than priced off a list.",
    scope: {
      included: ["Art direction and visual research", "Set and prop design", "Styling and texture", "Lighting mood"],
      excluded: ["Extras and talent", "Vehicles", "Locations", "Costumes"],
    },
    catalogueIds: [],
    packIds: [],
  },
  {
    slug: "full-production",
    name: "Full Visual Production",
    line: "Brief. Treatment. Shoot. Finish. One continuous pass from first decision to master.",
    intro:
      "The whole chain under one roof — concept, crew, shoot and finish, quoted as one piece of work rather than four handovers.",
    scope: {
      included: ["Concept and treatment", "Crew and equipment", "Shoot and supervision", "Edit, colour, sound, master"],
      excluded: ["Extras and talent", "Vehicles and locations", "Sets and costumes", "Licensed music"],
    },
    catalogueIds: ["full-production", "short-video"],
    packIds: ["shoots", "reels", "clips", "episodes"],
    showOnRequest: true,
  },
];

export const categoryBySlug = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
