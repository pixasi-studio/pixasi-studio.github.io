const { test, expect } = require("@playwright/test");
const { canvasIsPainted, collectErrors } = require("./helpers");

/* Under prefers-reduced-motion the script takes an entirely separate path:
   no rAF loops, no hover playback, no decode effect. The artwork still has to
   be there — "no animation" must not degrade to "blank canvas". */

/* Playwright 1.56 resolves `reducedMotion` into project.use but does not pass
   it through to the browser context, so emulate it on the page instead. It has
   to land before goto: the script reads matchMedia once, at load. */
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("the emulation is actually in effect", async ({ page }) => {
  /* Guard: without this, a silent emulation regression would leave every test
     below passing against the ordinary animated path and proving nothing. */
  await page.goto("/index.html");
  expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);
});

test("the page still boots cleanly", async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto("/index.html");
  await page.waitForTimeout(1000);
  expect(errors).toEqual([]);
});

test("tile artwork paints a static frame", async ({ page }) => {
  await page.goto("/index.html");
  await page.waitForTimeout(800);
  expect(await canvasIsPainted(page, "#grid .card canvas")).toBe(true);
});

test("the wordmark paints", async ({ page }) => {
  await page.goto("/index.html");
  await page.waitForTimeout(800);
  const painted = await page.evaluate(() => {
    const cv = document.getElementById("wordmark");
    if (!cv.width) return "zero-sized";
    const d = cv.getContext("2d").getImageData(0, 0, cv.width, cv.height).data;
    for (let i = 3; i < d.length; i += 4) if (d[i] > 0) return true;
    return false;
  });
  expect(painted).toBe(true);
});

test("the lightbox paints without animating", async ({ page }) => {
  await page.goto("/index.html");
  await page.locator("#grid .card").first().click();
  await page.locator("#lb[open]").waitFor();
  await page.waitForTimeout(400);
  expect(await canvasIsPainted(page, "#lb-canvas")).toBe(true);
});

test("the hero line is readable rather than scrambled", async ({ page }) => {
  await page.goto("/index.html");
  await page.waitForTimeout(800);
  const text = (await page.locator(".hero-lede").textContent()).trim();
  expect(text.length).toBeGreaterThan(10);
  // the decode effect substitutes from this glyph set; none should survive
  expect(text).not.toMatch(/[#\\<>{}*+=_]/);
});

test("hovering a tile does not start a scrub animation", async ({ page }) => {
  await page.goto("/index.html");
  await page.waitForTimeout(500);
  const card = page.locator("#grid .card").first();
  await card.hover();
  await page.waitForTimeout(700);
  const width = await card.locator(".scrub").evaluate((e) => e.style.width || "0");
  expect(["0", "", "0%"]).toContain(width);
});

test("the lightbox still opens, steps and closes", async ({ page }) => {
  await page.goto("/index.html");
  await page.locator("#grid .card").first().click();
  await page.locator("#lb[open]").waitFor();

  const first = await page.locator("#lb-title").textContent();
  await page.click("#lb-next");
  expect(await page.locator("#lb-title").textContent()).not.toBe(first);

  await page.keyboard.press("Escape");
  await expect(page.locator("#lb")).not.toHaveAttribute("open", "");
});
