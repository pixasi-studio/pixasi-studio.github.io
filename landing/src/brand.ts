/**
 * Every string on the page. The layout, motion and type scale come from
 * the supplied design; the content is anujsingh.notes', in the same
 * first-person voice as the rest of the site.
 */
export const BRAND = {
  /** The main title, in the navbar. */
  logo: "anujsingh.notes",

  /** Navbar sections, matching the notebook's entries. */
  links: ["Practice", "Plates", "Method", "Signal"],
  cta: "Get in touch",

  /** The two lines of the out-of-focus intro label. */
  introLine1: "Hey there, this is the field log,",
  introLine2: "visuals, video and creative tech by Anuj Singh",

  /** Typed one character at a time. */
  greeting:
    "Glad you stopped in. Everything here started as a note. So, what are we making?",

  /** The white action pills. */
  actions: [
    "Send a rough idea",
    "See the plates",
    "Say hello",
    "How I work",
  ],

  /** The outline pill: shown, and what the copy icon puts on the clipboard. */
  reach: "Reach me:",
  email: "iamasr@duck.com",
} as const;
