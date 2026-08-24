# Landing hero

React + TypeScript + Vite + Tailwind. A full-screen hero whose background
video is scrubbed by horizontal mouse movement rather than played.

    npm install
    npm run dev        # http://localhost:5173
    npm run build      # writes ../hero
    npm run preview

## Where the built output goes

This is the front page, so it builds to the repo root: `index.html` plus
`assets/`. Both are committed, because GitHub Pages serves this branch
with no build step.

`emptyOutDir` is **false and must stay false** — the out directory is the
repository itself, and emptying it would delete the project. Stale hashed
assets are cleared by the `prebuild` script, which only ever removes
`../assets`.

That means the built output **can go stale**: re-run `npm run build` and
commit it alongside any change under `landing/`. A workflow that builds
on push would be the better answer.

## The other page

The notebook lives at `/notes/` (source: `notes/index.html`). It is still
one self-contained file with no build step. The two link to each other:
this page's nav and pills point at the notebook's entries, and the
notebook's logo returns here.

## Brand strings

Every name, line and address lives in `src/brand.ts`.

The prompt this was built from opens by calling the agency
`anujsingh.notes`, then specifies `Mainframe®` for the logo, "Mainframe's
Adaptive Response Interface Agent" for the intro, and
`hello@mainframe.co` for the address. The detailed strings are what got
implemented; `src/brand.ts` is the one place to change them.

## External dependencies

Three URLs are loaded from other hosts, none of which could be reached
from the sandbox this was written in, so none of them are verified:

- the background video, on CloudFront
- two font stylesheets, on `db.onlinewebfonts.com`

The font stack falls back to Helvetica Neue / Arial, so the page is
readable either way. If the video 404s the page still works — it just has
no backdrop, since nothing else depends on it.
