# Pixasi

Personal site for **Pixasi** — visuals, video & creative tech by Anuj Singh.

- `index.html` — the entire site. Self-contained: fonts are embedded as base64,
  all artwork is generated on `<canvas>`, no external requests, no build step.

## Local preview

    python3 -m http.server 8000

Then open <http://localhost:8000>.

## Tests

Playwright drives the real page in a browser. Nothing here is served — the
site still has no build step and no runtime dependencies.

    npm install
    npx playwright install chromium
    npm test

`npm run test:ui` opens the interactive runner; `npm run report` shows the
last HTML report. Three projects cover the paths that behave differently:
`desktop`, `mobile` (touch, no hover) and `reduced-motion`.

## Deploy

Served as a static site from the repo root. Any static host works
(GitHub Pages, Cloudflare Pages, Netlify). Only `index.html` and `brand/`
are needed at runtime.

## Links

- Instagram — [@pixasi](https://instagram.com/pixasi)
- YouTube — [@pixasi](https://youtube.com/@pixasi)
- Facebook — [/pixasingh](https://facebook.com/pixasingh)
- Contact — iamasr@duck.com
