# anujsingh.notes

Anuj Singh — visuals, video & creative tech. One person, one desk.

Two pages:

| | | |
|---|---|---|
| `/` | **Landing** | Full-screen hero. The backdrop is a plotted figure drawn on `<canvas>` and scrubbed by horizontal mouse movement. React + TypeScript + Vite + Tailwind; source in `landing/`, built output at the root. |
| `/notes/` | **The notebook** | A working log kept in public. One self-contained `index.html`: fonts embedded, artwork drawn on `<canvas>`, no external requests, no build step. |

They link to each other — the landing page's nav and pills point at the
notebook's entries, and the notebook's mark returns to the landing page.

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
