export type Project = {
  slug: string;
  title: string;
  line: string;
  /** Named on the right of the reel, opposite the title. */
  kind: string;
  /** Column weight in the home band — the two sizes alternate per row. */
  span: 3 | 2;
  /** Plays on loop from the start there, no pointer needed. */
  autoplay?: boolean;
};

/**
 * The one list. The home band and the work stage both read it, so a project is
 * added or reordered in a single place.
 *
 * Titles are working titles on the supplied footage; swap them for the real ones.
 */
export const PROJECTS: Project[] = [
  {
    slug: "work-01",
    title: "Night Parade",
    line: "Music video — edit, sound design",
    kind: "Music video",
    span: 3,
  },
  {
    slug: "work-02",
    title: "Plumage",
    line: "Music video — edit",
    kind: "Music video",
    span: 2,
    autoplay: true,
  },
  {
    slug: "work-03",
    title: "Stairwell",
    line: "Music video — edit, sound design",
    kind: "Music video",
    span: 2,
    autoplay: true,
  },
  {
    slug: "work-04",
    title: "Nocturne",
    line: "Commercial",
    kind: "Commercial",
    span: 3,
  },
];
