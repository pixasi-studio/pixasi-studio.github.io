# Landing hero

React + TypeScript + Vite + Tailwind. One viewport-height section: a wide
display headline, a tracked tagline, a call to action and a stats row,
laid over a drawn backdrop.

## The backdrop is drawn, not filmed

The design this was built from specified a looping mp4 on a CloudFront
bucket. That file belongs to a third party, sits on a host this project
cannot reach, and is the thing that failed the last time it was wired
up. A locally encoded replacement was worse — the only encoder available
here produced VP9 inside an MP4, which iOS will not play, in a
fragmented container that reported the wrong duration and refused to
seek at all.

`Backdrop.tsx` draws it instead: a lit room, a key light drifting across
it, and a harmonograph — the same figure the notebook plots. There is no
request to fail, no codec to be unsupported and no megabytes to ship.
It loops on its own the way the video would have, and pointer or scroll
movement pushes it along on top of that.

**To use real footage**, host the file yourself, set `SRC` in
`BackgroundVideo.tsx`, and swap the import in `App.tsx`. That component
is the design's element as specified — `autoPlay muted loop playsInline`
on `object-cover` — and fills the same layer.

### Two things keep it cheap enough to leave running

A first pass repainted every layer each frame and measured **4fps** on a
4×-throttled phone. Both fixes are load-bearing:

- **The still layers are cached.** The room, the scrim, the grain and
  the vignette never change, so they are painted once into two plates
  and blitted either side of the moving parts. A frame is two image
  copies, one gradient and the trace — not seven full-canvas fills.
- **It renders one canvas pixel per CSS pixel.** This is a soft,
  near-black image; a retina buffer costs four times the fill rate and
  buys nothing visible.

Together: 60fps at 4×, 47fps at 6×, no frame over 50ms.

## Contrast is drawn in, not hoped for

The design puts white type straight onto the footage. Rather than trust
whatever the frame happens to be, `Backdrop` paints a scrim over the
side the copy sits on — full width on a phone, where the copy is full
width. The test asserts ≥7:1 (WCAG AAA) at two dozen points under the
headline; it currently measures about 17:1.

## Type

Both faces are served from this origin — `public/fonts`, copied to
`/fonts` by the build. **The page makes no external requests at all**:
no font CDN, no analytics, no video host.

- **`font-podium`** — the display face, for the wordmark and headline.
  The design named *PODIUM Sharp*, which is only sold through a font CDN
  that is unreachable from here. Archivo is the notebook's own display
  face and carries a width axis to 125%, so `.font-podium` sets
  `font-stretch: 116%` to get the wide, heavy cut the design wants — and
  the two pages end up set in the same type.
- **`font-inter`** — Inter, as specified, for body copy, nav and stats.

## Brand strings

Every name, line and address lives in `src/brand.ts`. Two things there
are deliberate departures from the design:

- **It is first person singular throughout.** This is one person at one
  desk, so there is no "we" anywhere on the page, and a test fails on
  any `we`/`us`/`our` in the rendered text.
- **The numbers are different.** The design's stats — 250+ brands
  transformed, 95% client retention, 10+ years — were an agency's
  claims. They are replaced with three that are true.

    npm install
    npm run dev        # http://localhost:5173
    npm run build      # writes ../index.html, ../assets, ../fonts
    npm run preview

## Where the built output goes

This is the front page, so it builds to the repo root: `index.html`,
`assets/` and `fonts/`. All three are committed, because GitHub Pages
serves this branch with no build step.

`emptyOutDir` is **false and must stay false** — the out directory is the
repository itself, and emptying it would delete the project. Stale
hashed assets are cleared by the `prebuild` script, which only ever
removes `../assets`.

That means the built output **can go stale**: re-run `npm run build` and
commit it alongside any change under `landing/`. A workflow that builds
on push would be the better answer.

## The other page

The notebook lives at `/notes/` (source: `notes/index.html`), still one
self-contained file with no build step. The two link to each other: this
page's nav, menu and button point at the notebook's entries, and the
notebook's mark returns here.
