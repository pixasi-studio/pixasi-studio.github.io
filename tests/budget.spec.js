const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
const { INDEX, source } = require("./helpers");

/* index.html is render-blocking by construction: the fonts are base64'd into
   it. That is a deliberate trade (no external requests, no build step), but it
   only stays a good trade while the file stays small. */

const KB = 1024;
const MAX_INDEX_KB = 280;
const MAX_FONT_SHARE = 0.8;
const MAX_BRAND_KB = 200;

test("index.html stays under the size ceiling", () => {
  const bytes = fs.statSync(INDEX).size;
  expect(
    bytes,
    `index.html is ${(bytes / KB).toFixed(0)}KB, over the ${MAX_INDEX_KB}KB budget — it blocks first paint`
  ).toBeLessThan(MAX_INDEX_KB * KB);
});

test("inlined fonts stay a bounded share of the page", () => {
  const src = source();
  const fonts = [...src.matchAll(/base64,([A-Za-z0-9+/=]+)/g)].reduce((n, m) => n + m[1].length, 0);
  const share = fonts / src.length;
  expect(
    share,
    `${(share * 100).toFixed(0)}% of index.html is base64 font data — adding weights costs first paint directly`
  ).toBeLessThan(MAX_FONT_SHARE);
});

test("no more font faces creep in than the three the design uses", () => {
  const faces = [...source().matchAll(/@font-face/g)].length;
  expect(faces).toBeLessThanOrEqual(3);
});

test("brand assets stay reasonable", () => {
  const dir = path.join(__dirname, "..", "brand");
  const total = fs
    .readdirSync(dir)
    .filter((f) => !f.startsWith("."))
    .reduce((n, f) => n + fs.statSync(path.join(dir, f)).size, 0);
  expect(total / KB).toBeLessThan(MAX_BRAND_KB);
});

test("the favicon the markup points at exists", () => {
  const src = source();
  const refs = [...src.matchAll(/(?:href|src)="(brand\/[^"]+)"/g)].map((m) => m[1]);
  expect(refs.length).toBeGreaterThan(0);
  for (const r of refs) {
    expect(fs.existsSync(path.join(__dirname, "..", r)), `${r} referenced but missing`).toBe(true);
  }
});

test("first paint is not gated on anything slow", async ({ page }) => {
  await page.goto("/index.html");
  const fcp = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const seen = performance.getEntriesByName("first-contentful-paint")[0];
        if (seen) return resolve(seen.startTime);
        new PerformanceObserver((list, obs) => {
          const e = list.getEntriesByName("first-contentful-paint")[0];
          if (e) {
            obs.disconnect();
            resolve(e.startTime);
          }
        }).observe({ type: "paint", buffered: true });
        setTimeout(() => resolve(-1), 5000);
      })
  );
  expect(fcp).toBeGreaterThan(-1);
  expect(fcp, "first contentful paint regressed past 2s on a local file").toBeLessThan(2000);
});
