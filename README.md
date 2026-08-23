# anuj.fieldnotes

Working notebook of **Anuj Singh** — visuals, video & creative tech, kept in public.

- `index.html` — the entire site. Self-contained: fonts are embedded as base64,
  all artwork is drawn on `<canvas>`, no external requests, no build step.
- `brand/` — the home-screen icon. The favicon is an inline SVG in the head.

> The GitHub org is still named `pixasi-studio`, which is what fixes the live
> address at `pixasi-studio.github.io`. Renaming the org (and this repo to
> `<new-org>.github.io`) is the one step that has to be done in GitHub's
> settings; the canonical URL, `og:url`, `og:image` and the GitHub link in the
> footer all point there and need updating together afterwards.

## What's interactive

Everything answers to either scrolling or tapping:

- **The lit field** — four slow blooms drawn into a 200x120 canvas and
  stretched over the viewport. Being upscaled that far is the point: it
  arrives already soft, so every panel above it is plain translucent paint
  and still reads as glass, with no `backdrop-filter` to pay for. Painted at
  ~12fps, solved every frame.
- **Cover mark** — the name is rasterised, sampled onto a grid, and lives as a
  field of cells with their own physics. Each cell takes its colour from the
  field passing underneath, so the letterforms are windows onto the
  background rather than paint on top of it. It follows a pointer or a
  finger, sweeps itself when nobody is driving, and scatters as you scroll
  away. Tap the plate to redraw it: `plot → ink → contour → scatter`.
- **The paper** — ruled graph paper that drifts with scroll, with a second
  copy in red masked to a disc that follows the pointer (mouse only).
- **One mark that slides** — nav, filters and the view toggle each move a
  single indicator rather than repainting a new active item, so a state
  change reads as travel.
- **Ink** — every tap leaves a mark on the page that soaks in and fades.
- **Pencil underlines** — key phrases draw and un-draw as they scroll past.
- **Plates** — each is a live canvas. Hover (or centre it on a phone) to play;
  drag sideways to scrub it by hand; tap to open the viewer.
- **The survey** — a sticky plot in Entry 03 that draws itself across three
  bands as you scroll, lighting the matching method as it goes.
- **Marginalia** — the facts list pins open on tap.
- **Margin ruler** — page count and scroll rate, read off the right edge.
- **Everything else** — the registration mark turns continuously and spins up
  on hover, form fields draw a rule under the caret, buttons fill from an
  edge, and the footer strip breathes.

Reduced motion is respected throughout, and the page stays readable with
JavaScript off.

## Local preview

    python3 -m http.server 8000

Then open <http://localhost:8000>.

## Deploy

Served as a static site from the repo root. Any static host works
(GitHub Pages, Cloudflare Pages, Netlify).

## Links

- Instagram — [@anuj.fieldnotes](https://instagram.com/anuj.fieldnotes)
- YouTube — [@anuj.fieldnotes](https://youtube.com/@anuj.fieldnotes)
- Facebook — [/anuj.fieldnotes](https://facebook.com/anuj.fieldnotes)
- Contact — iamasr@duck.com
