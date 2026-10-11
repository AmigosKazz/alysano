/**
 * The one catalogue. Every services page reads from here, so a rate card is
 * changed in a single place and the site follows.
 *
 * Three rules hold the whole file together:
 *
 * 1. A figure is never written here. This is what any visitor may read — what
 *    each discipline covers, how its rate cards are laid out, how a quote is
 *    built. The figures sit in `lib/rates.server.ts`, keyed by the ids and row
 *    keys below, and cannot be imported by a client component. That is why this
 *    file can be: the contact form and the rate card both pull from it.
 *
 * 2. A price is a value, never a string. The source documents wrote the same
 *    idea five ways ("300k", "1.5M Ar+", "350K+", "Sur devis", "—"); it is one
 *    shape and one formatter (`lib/money.ts`), so the page decides how it reads.
 *
 * 3. A catalogue is referenced, never copied. Three tables appeared twice
 *    across the source documents — full production, short video, and the
 *    quote-only list. They are defined once below and pointed at by id from
 *    both categories that show them, which makes drift impossible.
 *
 * TODO: the fifteen conditions are contractual wording translated from the
 * French originals. Aly should read them before this goes live.
 */

/* ------------------------------------------------------------------ */
/* Catalogues                                                          */
/* ------------------------------------------------------------------ */

export type Row = {
  /** What the rates are keyed by, so the label can be reworded freely. */
  key: string;
  label: string;
  /** Long tables are grouped so the eye has landmarks — see `editing`. */
  group?: string;
};

export type Catalogue = {
  id: string;
  title: string;
  /** Kept per catalogue: the source used three different namings for the same
   *  three levels, and flattening them would lose the client's own vocabulary. */
  tiers: readonly [string, string, string];
  /** Which tier the studio puts forward. Index into `tiers`. */
  recommended?: 0 | 1 | 2;
  note?: string;
  rows: readonly Row[];
  /** Rows that carry no grid information — every tier is "on request". Pulled
   *  out of the table so the matrix stays worth reading. */
  onRequest?: readonly string[];
};

const DOP_TIERS: [string, string, string] = ["Starting", "Signature", "Premium"];
const STUDIO_TIERS: [string, string, string] = ["Essential", "Signature", "Premium"];
const POST_TIERS: [string, string, string] = ["Starting", "Recommended", "Premium"];

export const CATALOGUES = {
  /* ---- Shooting & direction of photography ---- */
  events: {
    id: "events",
    title: "Events",
    tiers: DOP_TIERS,
    recommended: 1,
    rows: [
      { key: "light", label: "Event Light" },
      { key: "standard", label: "Event Standard" },
      { key: "club", label: "DJ / Night club" },
      { key: "concert", label: "Concert / Live event" },
      { key: "full", label: "Full event coverage" },
    ],
  },

  "music-video-dop": {
    id: "music-video-dop",
    title: "Music videos",
    tiers: DOP_TIERS,
    recommended: 1,
    rows: [
      { key: "half-day", label: "Half day (up to 5h)" },
      { key: "full-day", label: "Full day (up to 10h)" },
      { key: "ambitious", label: "Ambitious project" },
    ],
  },

  "commercial-dop": {
    id: "commercial-dop",
    title: "Advertising & brand",
    tiers: DOP_TIERS,
    recommended: 1,
    rows: [
      { key: "digital-spot", label: "Digital spot" },
      { key: "commercial", label: "Advertising / Commercial" },
      { key: "campaign", label: "Campaign / Multi-day" },
    ],
  },

  "narrative-dop": {
    id: "narrative-dop",
    title: "Film & narrative",
    tiers: DOP_TIERS,
    recommended: 1,
    rows: [{ key: "short-film", label: "Short film" }],
    onRequest: ["Feature film", "Documentary"],
  },

  "short-form-dop": {
    id: "short-form-dop",
    title: "Short-form content",
    tiers: DOP_TIERS,
    recommended: 1,
    rows: [
      { key: "reel", label: "Reels / TikTok / Instagram (up to 1 min)" },
      { key: "pack", label: "Content pack (several videos)" },
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
      { key: "music-video", label: "Music video" },
      { key: "spot", label: "Advertising / Spot" },
      { key: "brand-film", label: "Brand film" },
      { key: "corporate", label: "Corporate / Institutional" },
      { key: "social-campaign", label: "Social media campaign" },
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
      { key: "15-30s", label: "15–30 sec" },
      { key: "30-60s", label: "30–60 sec" },
      { key: "1-2min", label: "1–2 min" },
      { key: "2-3min", label: "2–3 min" },
      { key: "3-5min", label: "3–5 min" },
    ],
  },

  /* ---- Post-production ---- */
  editing: {
    id: "editing",
    title: "Editing",
    tiers: POST_TIERS,
    recommended: 1,
    rows: [
      { key: "reel", group: "Short form", label: "Short / Reel, up to 60s" },
      { key: "short", group: "Short form", label: "Short, 1–3 min" },
      { key: "youtube-10", group: "Long form", label: "YouTube / Vlog, 5–10 min" },
      { key: "youtube-20", group: "Long form", label: "YouTube / Vlog, 10–20 min" },
      { key: "interview", group: "Long form", label: "Interview / Podcast" },
      { key: "corporate", group: "Brand & commercial", label: "Corporate / Brand" },
      { key: "commercial", group: "Brand & commercial", label: "Advertisement / Commercial" },
      { key: "music-video", group: "Brand & commercial", label: "Music video" },
      { key: "short-film-5", group: "Narrative", label: "Narrative short film, up to 5 min" },
      { key: "short-film-15", group: "Narrative", label: "Narrative short film, 5–15 min" },
      { key: "documentary", group: "Narrative", label: "Documentary, up to 10 min" },
    ],
  },

  "sound-design": {
    id: "sound-design",
    title: "Sound design",
    tiers: POST_TIERS,
    recommended: 1,
    rows: [
      { key: "cleanup", label: "Sound editing / Cleanup" },
      { key: "design-1", label: "Sound design, up to 1 min" },
      { key: "design-3", label: "Sound design, 1–3 min" },
      { key: "design-5", label: "Sound design, 3–5 min" },
      { key: "design-10", label: "Sound design, 5–10 min" },
      { key: "cinematic", label: "Cinematic / Narrative" },
    ],
  },
} as const satisfies Record<string, Catalogue>;

export type CatalogueId = keyof typeof CATALOGUES;

/** The rows of one catalogue — exactly what its rates must be given for. */
export type RowKey<C extends CatalogueId> = (typeof CATALOGUES)[C]["rows"][number]["key"];

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

export type Pack = {
  id: string;
  title: string;
  note?: string;
  /** Keyed like a rate card's rows: the discounts are on the server. */
  steps: readonly { key: string; label: string }[];
};

export const PACKS = {
  shoots: {
    id: "shoots",
    title: "Shoot packs",
    note: "Booked as one run.",
    steps: [
      { key: "3", label: "3 shoots" },
      { key: "5", label: "5 shoots" },
      { key: "10", label: "10 shoots" },
      { key: "recurring", label: "Recurring production" },
    ],
  },
  reels: {
    id: "reels",
    title: "Reels",
    steps: [
      { key: "1", label: "1 reel" },
      { key: "5", label: "5 reels" },
      { key: "10", label: "10 reels" },
      { key: "20", label: "20 reels" },
      { key: "30+", label: "30 and over" },
    ],
  },
  clips: {
    id: "clips",
    title: "Clips",
    steps: [
      { key: "1", label: "1 clip" },
      { key: "2", label: "2 clips" },
      { key: "3", label: "3 clips" },
      { key: "5", label: "5 clips" },
      { key: "5+", label: "More than 5" },
    ],
  },
  episodes: {
    id: "episodes",
    title: "Episodes & series",
    steps: [
      { key: "1", label: "1 episode" },
      { key: "3", label: "3 episodes" },
      { key: "5", label: "5 episodes" },
      { key: "8", label: "8 episodes" },
      { key: "10", label: "10 episodes" },
      { key: "10+", label: "More than 10" },
    ],
  },
} as const satisfies Record<string, Pack>;

export type PackId = keyof typeof PACKS;

export type StepKey<P extends PackId> = (typeof PACKS)[P]["steps"][number]["key"];

/* ------------------------------------------------------------------ */
/* The path to a quote                                                 */
/* ------------------------------------------------------------------ */

export type StudyStep = {
  key: string;
  label: string;
  detail: string;
  /** What the step costs, when that is not a figure. A step without one is the
   *  paid step: its fee is kept on the server with the rest. */
  fee?: string;
};

export const PROJECT_STUDY: { line: string; steps: readonly StudyStep[] } = {
  line: "Settled once the brief is clear, before the script is read and the quote is prepared.",
  steps: [
    { key: "brief", label: "Brief", detail: "Objectives, references, constraints", fee: "—" },
    { key: "script", label: "Script study", detail: "Reading the story and what it needs" },
    { key: "preparation", label: "Preparation", detail: "Crew, equipment, production", fee: "Per quote" },
    { key: "quote", label: "Quote", detail: "A budget matched to the project", fee: "Included in the study" },
  ],
};

/** The one step whose fee is a figure. */
export type PaidStepKey = "script";

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
  catalogueIds: CatalogueId[];
  packIds: PackId[];
  /** Answers to what a visitor asks before writing. Shown once there are some.
   *  TODO: the questions and answers come from Aly — none are written here. */
  faq?: readonly { question: string; answer: string }[];
  /** The shared seven. */
  showOnRequest?: boolean;
};

export const CATEGORIES: Category[] = [
  {
    slug: "directing",
    name: "Directing",
    line: "Treatment. Shot design. Casting eye. On-set direction. Performance and blocking.",
    intro:
      "Behind the camera, or in front of the whole thing. The first rate cards are for the shoot itself; the last two carry a piece end to end.",
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
