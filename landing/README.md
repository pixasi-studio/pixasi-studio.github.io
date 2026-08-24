# Landing hero

React + TypeScript + Vite + Tailwind. A full-screen hero whose background
video is scrubbed by horizontal mouse movement rather than played.

    npm install
    npm run dev        # http://localhost:5173
    npm run build      # writes ../hero
    npm run preview

## Where the built output goes

`vite.config.ts` sets `base: "/hero/"` and `build.outDir: "../hero"`, and
`hero/` is committed. GitHub Pages serves this repo straight from the
branch with no build step, so the built files have to be in the tree for
the page to exist at `/hero/`.

That means **`hero/` can go stale**: re-run `npm run build` and commit it
alongside any change under `landing/`. If that gets annoying, the better
fix is a workflow that builds on push and publishes the artifact — happy
to add one.

This is a separate page. The root `index.html` — the anuj.fieldnotes
notebook — is untouched and still self-contained with no build step.

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
