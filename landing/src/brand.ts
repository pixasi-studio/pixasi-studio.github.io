/**
 * Every string on the page, in one place.
 *
 * The layout, type scale and motion come from the supplied design. The
 * words are mine, and they are first person singular throughout: this
 * is one person at one desk, not a collective, so there is no "we"
 * anywhere on the page and a test fails the build if one appears.
 *
 * The design's numbers ("250+ brands transformed", "95% client
 * retention", "10+ years in the game") were an agency's claims, not
 * mine, so they are replaced with three that are true. Change them
 * here and nowhere else.
 */
export const BRAND = {
  /** The wordmark, in the navbar and at the top of the mobile menu. */
  logo: "anujsingh.notes",

  /** The notebook's sections. Every link goes into it. */
  links: [
    { label: "Plates", href: "/notes/#plates" },
    { label: "Practice", href: "/notes/#practice" },
    { label: "Method", href: "/notes/#method" },
    { label: "Signal", href: "/notes/#signal" },
  ],

  /** The bordered navbar button, and the same button in the menu. */
  cta: { label: "Get in touch", href: "mailto:iamasr@duck.com" },

  /** Shown under the menu's button so the address is readable, not just linked. */
  email: "iamasr@duck.com",

  /** The small tracked line above the headline, next to the crown. */
  tagline: "One person, one desk",

  /** Three lines, one word each. */
  heading: ["Notice.", "Sketch.", "Ship."],

  /** Two lines, then the part that is set in solid white. */
  subtextLine1: "I make visuals, video and creative tech.",
  subtextLine2: "Every job is mine end to end —",
  subtextStrong: "and it ships.",

  /** The black button. */
  action: { label: "See the plates", href: "/notes/#plates" },

  /** The badge beside it, next to the award mark. */
  badge: ["One person", "Start to finish"],

  /** The row along the bottom. */
  stats: [
    { value: "01", label: "Person on every job" },
    { value: "00", label: "Handoffs" },
    { value: "OPEN", label: "Notebook, in public" },
  ],
} as const;
