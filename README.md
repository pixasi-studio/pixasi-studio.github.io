# anujsingh.notes

Anuj Singh — visuals, video & creative tech. One person, one desk.

| | | |
|---|---|---|
| `/` | **The site** | One page, five parts: the hero, the practice, the plates, the method and the contact block. The backdrop is drawn on `<canvas>` — a crimson field, a drifting key light and a plotted figure — that loops on its own and is pushed along by pointer or scroll. Self-hosted type, no external requests. React + TypeScript + Vite + Tailwind; source in `landing/`, built output at the root. |
| `/notes/` | **The notebook** | The working log, kept as its own page. One self-contained `index.html`: fonts embedded, artwork drawn on `<canvas>`, no external requests, no build step. Linked from the site's footer; its mark returns to the site. |

Both speak in the first person singular. This is one person at one desk;
there is no "we" on either page, and a test fails on one.

## What's on the front page

Everything resolves in the page — the nav, the menu and every button are
anchors into it.

- **Hero** — the display headline over the live crimson field, with the
  entrance staggered and the stats along the bottom.
- **A running band** — six words, looped seamlessly by translating a
  doubled strip exactly half its width.
- **01 The practice** — who I am and how the three disciplines sit at one
  desk, beside a facts list that pins open one row at a time.
- **02 Plates** — six pieces, each drawn live on `<canvas>` in its own
  discipline's language: a waveform with the cut marked, a harmonograph,
  a render queue. Filterable by discipline; each opens the piece on
  Instagram.
- **03 Method** — the three ways a job usually goes, with what each one
  covers.
- **04 Signal** — the crimson block: the address, a copy button, the
  profiles, and a form that composes a draft in your own mail app.
  Nothing is posted anywhere.
- **Throughout** — sections arrive as you reach them and stay put, the
  navbar marks the section you are in and takes a ground of its own once
  content is under it, and the whole thing holds still under
  `prefers-reduced-motion`.

## What's interactive in the notebook

Everything answers to either scrolling or tapping:

- **The lit field** — four slow blooms drawn into a 200x120 canvas and
  stretched over the viewport. Being upscaled that far is the point: it
  arrives already soft, so every panel above it is plain translucent paint
  and still reads as glass, with no `backdrop-filter` to pay for. Painted at
  ~12fps, solved every frame.
- **Cover mark** — the name is rasterised, sampled onto a grid, and lives as a
  field of cells with their own physics. Each cell takes its colour from the
  field passing underneath, so the letterforms are windows onto the
  background rather than paint on top of it. Tap the plate to redraw it:
  `plot → ink → contour → scatter`.

  **It holds still.** There is no idle sweep and no ambient wobble: it moves
  only while a pointer, a finger or a device tilt is moving it, then settles
  and stops being drawn at all. Cells carry a depth plane, so movement parts
  the mark into layers rather than sliding one flat sheet.
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
- **Depth** — plates tilt in real 3D toward whatever is pointing at them,
  with their labels floating above the surface on `translateZ`; the viewer
  arrives with perspective rather than a fade.
- **Everything else** — the registration mark turns continuously and spins up
  on hover, form fields draw a rule under the caret, buttons fill from an
  edge, the CTA and the copy button lean toward the cursor, and the footer
  strip breathes.
- **Keys** — `G`/`L` switch view, `1`–`4` filter, `T` inverts. Ignored while
  the viewer is open or while you are typing.

## Behaviour worth not regressing

Three defects were found in an earlier audit, lost in a rebuild, and fixed
again here. They are easy to reintroduce:

- The viewer reads the **active filter**. Stepping must stay inside the
  filtered set, and the counter must report position within it — not an
  index into the full array.
- The panel **contains focus**. `aria-modal` on a plain `<div>` is not
  enforced, so everything outside goes `inert` and Tab wraps inside. `inert`
  must be cleared *before* focus is restored, since an inert element refuses
  it.
- The **theme choice persists**, applied by a small script in `<head>` so a
  returning visitor never sees the system theme flip to their choice.

Reduced motion is respected throughout, and the page stays readable with
JavaScript off.

## Local preview

    python3 -m http.server 8000

Serves both pages as deployed: <http://localhost:8000> for the landing
page, <http://localhost:8000/notes/> for the notebook.

To work on the landing page with hot reload instead:

    cd landing && npm install && npm run dev

## Deploy

Served as a static site from the repo root. Any static host works
(GitHub Pages, Cloudflare Pages, Netlify).

## Links

- Instagram — [@anuj.fieldnotes](https://instagram.com/anuj.fieldnotes)
- YouTube — [@anuj.fieldnotes](https://youtube.com/@anuj.fieldnotes)
- Facebook — [/anuj.fieldnotes](https://facebook.com/anuj.fieldnotes)
- Contact — iamasr@duck.com
