/**
 * Every string on the page. The layout, motion and type scale come from
 * the supplied design; the content is anujsingh.notes', in the same
 * first-person voice as the rest of the site.
 */
export const BRAND = {
  /** The main title, in the navbar. */
  logo: "anujsingh.notes",

  /** Navbar sections. These are the notebook's entries, and they link to it. */
  links: [
    { label: "Practice", href: "/notes/#practice" },
    { label: "Plates", href: "/notes/#plates" },
    { label: "Method", href: "/notes/#method" },
    { label: "Signal", href: "/notes/#signal" },
  ],
  cta: { label: "Get in touch", href: "/notes/#signal" },

  /** The two lines of the out-of-focus intro label. */
  introLine1: "Hey there, this is the field log,",
  introLine2: "visuals, video and creative tech by Anuj Singh",

  /** Typed one character at a time. */
  greeting:
    "Glad you stopped in. Everything here started as a note. So, what can I make you?",

  /** The white action pills. */
  actions: [
    { label: "Send a rough idea", href: "/notes/#signal" },
    { label: "See the plates", href: "/notes/#plates" },
    { label: "Say hello", href: "mailto:iamasr@duck.com" },
    { label: "How I work", href: "/notes/#method" },
  ],

  /** The outline pill: shown, and what the copy icon puts on the clipboard. */
  reach: "Reach me:",
  email: "iamasr@duck.com",
} as const;
