/**
 * Every string on the site, in one place.
 *
 * The layout, type scale and motion come from the supplied design. The
 * words are mine, and they are first person singular throughout: this
 * is one person at one desk, not a collective, so there is no "we"
 * anywhere on the page and a test fails the build if one appears.
 *
 * The design's numbers ("250+ brands transformed", "95% client
 * retention", "10+ years in the game") were an agency's claims, not
 * mine, so they are replaced with three that are true.
 */

export const BRAND = {
  /* The wordmark is the person, because the practice is one person.
     anujsingh.notes stays the name of the publication - the notebook,
     the domain, the thing work gets filed under. */
  logo: "Anuj Singh",
  name: "Anuj Singh",
  publication: "anujsingh.notes",
  email: "iamasr@duck.com",
  handle: "@anuj.fieldnotes",
  instagram: "https://instagram.com/anuj.fieldnotes",
  youtube: "https://youtube.com/@anuj.fieldnotes",
  facebook: "https://facebook.com/anuj.fieldnotes",
  /** The working notebook, still its own self-contained page. */
  notebook: "/notes/",

  /** Everything resolves on this page now. */
  links: [
    { label: "Practice", href: "#practice" },
    { label: "Plates", href: "#plates" },
    { label: "Method", href: "#method" },
    { label: "Signal", href: "#signal" },
  ],
  cta: { label: "Get in touch", href: "#signal" },

  hero: {
    tagline: "One person, one desk",
    heading: ["Notice.", "Sketch.", "Ship."],
    subtextLine1: "I make visuals, video and creative tech.",
    subtextLine2: "Every job is mine end to end —",
    subtextStrong: "and it ships.",
    action: { label: "See the plates", href: "#plates" },
    badge: ["One person", "Start to finish"],
    stats: [
      { value: "01", label: "Person on every job" },
      { value: "00", label: "Handoffs" },
      { value: "OPEN", label: "Notebook, in public" },
    ],
    scrollCue: "Keep going",
  },

  /** The band under the hero. */
  ticker: [
    "Visuals",
    "Video",
    "Creative tech",
    "One desk",
    "No handoffs",
    "Kept in public",
  ],

  practice: {
    index: "01",
    eyebrow: "The practice",
    heading: "One desk, three disciplines, no house style.",
    lead: "I'm Anuj Singh. anujsingh.notes is where the work gets written down — visuals, video, and the code that lets both exist.",
    body: [
      "Most of what I make sits between disciplines: a frame that needed a shader, an edit that needed a script, an idea that was faster to build than to brief. Keeping all three at one desk means nothing gets lost in the handoff, and the technical answer and the visual one arrive together.",
      "No house style is the point. The look should come out of the material in front of me, not out of a preset I reuse until it stops meaning anything.",
      "This page is the index. The log itself runs day to day on Instagram, where things go up rougher and sooner.",
    ],
    facts: [
      {
        k: "Name",
        v: "Anuj Singh",
        d: "One person. No account team, no handoff, no telephone game.",
      },
      {
        k: "Filed under",
        v: "anujsingh.notes",
        d: "The notebook this page is. Everything here started as a note to myself.",
      },
      {
        k: "Practice",
        v: "Visuals, video, creative tech",
        d: "Three disciplines at one desk, so the technical answer and the visual one turn up together.",
      },
      {
        k: "Toolkit",
        v: "DaVinci Resolve Studio, Final Cut Pro, Motion, Claude, Antigravity",
        d: "Tools rotate. The method — look hard, cut early, keep notes — does not.",
      },
      {
        k: "Field",
        v: "instagram.com/anuj.fieldnotes",
        d: "The running log: rougher, faster and further ahead than this page.",
        href: "https://instagram.com/anuj.fieldnotes",
        linkLabel: "Open it",
      },
      {
        k: "Enquiries",
        v: "iamasr@duck.com",
        d: "A reference and a deadline is enough to start.",
        href: "mailto:iamasr@duck.com",
        linkLabel: "Write to me",
      },
    ],
  },

  plates: {
    index: "02",
    eyebrow: "Plates",
    heading: "Plates from the log.",
    lead: "Each plate is drawn here in the browser, then filed. The piece itself lives on Instagram — that is where things go up first, rougher and sooner.",
    filters: [
      { label: "All", value: "all" },
      { label: "Video", value: "film" },
      { label: "Visuals", value: "motion" },
      { label: "Tech", value: "tech" },
    ],
    items: [
      { no: "01", t: "Handheld, late light", cat: "film", kind: "Video", format: "Reel", seed: 11,
        d: "A reel from the log. Open it on Instagram for the full clip, sound and caption." },
      { no: "02", t: "Frame, held", cat: "film", kind: "Video", format: "Post", seed: 23,
        d: "Posted to the log. Open it on Instagram for the full piece and caption." },
      { no: "03", t: "Colour study 04", cat: "motion", kind: "Visuals", format: "Post", seed: 36,
        d: "A colour pass kept as a note. Open it on Instagram for the full set." },
      { no: "04", t: "Still, plotted", cat: "motion", kind: "Visuals", format: "Post", seed: 53,
        d: "A still worked up from a plotted curve. Open it on Instagram for the full set." },
      { no: "05", t: "Machine assist", cat: "tech", kind: "Creative tech", format: "Post", seed: 71,
        d: "A build, a tool, or a piece of process. Open it on Instagram for the walkthrough." },
      { no: "06", t: "Prototype, unfinished", cat: "tech", kind: "Creative tech", format: "Post", seed: 90,
        d: "Left deliberately rough. Open it on Instagram for the walkthrough." },
    ],
    empty: "Nothing filed under that yet.",
  },

  method: {
    index: "03",
    eyebrow: "Method",
    heading: "Three ways this usually goes.",
    lead: "Pick the one that sounds like your problem. Most jobs turn out to be two of them wearing a trench coat, which is the argument for keeping all three at one desk.",
    items: [
      {
        idx: "A",
        t: "Video & edit",
        d: "Pieces where the cut carries the weight. I take it from rushes to graded master, or step in when an edit has stalled and someone needs to say why.",
        bullets: ["Short-form & reels", "Product and founder films", "Edit rescue & recut", "Grade and finish"],
      },
      {
        idx: "B",
        t: "Visuals & motion",
        d: "A moving system rather than a one-off animation — rules for how a brand behaves in time, handed over so your team can keep making with it after I leave.",
        bullets: ["Title sequences & stings", "Motion rules & timing scales", "Template kits for in-house use", "Launch asset systems"],
      },
      {
        idx: "C",
        t: "Creative tech",
        d: "When the idea needs code to exist. Generative visuals, render pipelines, and small internal tools built for people who are not engineers.",
        bullets: ["Generative & data-driven visuals", "WebGL and canvas pieces", "Batch render automation", "Small internal tools"],
      },
    ],
  },

  signal: {
    index: "04",
    eyebrow: "Signal",
    heading: ["Got something", "half-formed?"],
    say: "Half-formed is the good stage. Send the rough version — a reference, a deadline, a budget range — and I'll tell you straight whether I'm the right person for it.",
    copy: "Copy",
    copied: "Copied",
    form: {
      name: { label: "Your name", placeholder: "Who's asking" },
      kind: {
        label: "What kind of thing",
        options: ["Video or edit", "Visuals or motion", "Creative tech", "Not sure yet"],
      },
      when: { label: "Rough timeline", placeholder: "e.g. shoots in March, delivers April" },
      msg: {
        label: "The rough version",
        placeholder: "What it is, who it's for, and what's making it hard.",
      },
      submit: "Compose the email",
      note: "This opens a draft in your own mail app — nothing is sent or stored here.",
    },
    socials: [
      { h: "Instagram", v: "@anuj.fieldnotes", href: "https://instagram.com/anuj.fieldnotes" },
      { h: "YouTube", v: "@anuj.fieldnotes", href: "https://youtube.com/@anuj.fieldnotes" },
      { h: "Facebook", v: "/anuj.fieldnotes", href: "https://facebook.com/anuj.fieldnotes" },
    ],
  },

  /* The rail along the bottom of the mobile menu. */
  menuFoot: "Visuals · Video · Creative tech",

  footer: {
    line: "Visuals, video and creative tech. One person, one desk.",
    notebook: "Open the notebook",
    notebookNote: "The working log, kept as its own page.",
    top: "Back to top",
    rights: "All work here is mine.",
  },
} as const;
