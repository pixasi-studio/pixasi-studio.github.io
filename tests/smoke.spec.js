const { test, expect } = require("@playwright/test");
const { referencedIds, collectErrors, canvasIsPainted } = require("./helpers");

/* The whole script is one IIFE with no null-guards on its DOM lookups, so a
   single renamed id throws and silently takes every feature below it with it.
   These are the tests that catch that. */

test.describe("page boots", () => {
  test("loads with no console or page errors", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/index.html");
    await page.waitForTimeout(1200);
    expect(errors).toEqual([]);
  });

  test("every id the script looks up exists in the markup", async ({ page }) => {
    await page.goto("/index.html");
    const ids = referencedIds();
    expect(ids.length).toBeGreaterThan(15); // guard against the regex silently matching nothing

    const missing = [];
    for (const id of ids) {
      if ((await page.locator(`[id="${id}"]`).count()) === 0) missing.push(id);
    }
    expect(missing, "getElementById targets with no matching element").toEqual([]);
  });

  test("critical class hooks resolve", async ({ page }) => {
    await page.goto("/index.html");
    // selectors the script drives behaviour from; zero matches means a dead feature
    for (const sel of [".filters button", ".card", ".chap", ".hero-lede", ".reveal"]) {
      expect(await page.locator(sel).count(), `no elements match ${sel}`).toBeGreaterThan(0);
    }
  });

  test("the work grid builds every tile with its parts", async ({ page }) => {
    await page.goto("/index.html");
    const cards = page.locator("#grid .card");
    await expect(cards).toHaveCount(6);

    for (let i = 0; i < 6; i++) {
      const c = cards.nth(i);
      await expect(c.locator("canvas")).toHaveCount(1);
      await expect(c.locator(".badge")).toHaveCount(1);
      await expect(c.locator(".scrub")).toHaveCount(1);
      await expect(c.locator(".t")).not.toHaveText("");
      expect(await c.getAttribute("data-cat")).toBeTruthy();
    }
  });

  test("the chapter rail builds from CHAPTERS", async ({ page }) => {
    await page.goto("/index.html");
    // built regardless of viewport; CSS hides it below 1081px in favour of .mrail
    await expect(page.locator("#rail .chap")).toHaveCount(5);
    await expect(page.locator("#rail")).toHaveAttribute("aria-label", "Chapters");
    // the rail starts aria-hidden in markup and is un-hidden by script
    await expect(page.locator("#rail")).not.toHaveAttribute("aria-hidden", "true");
  });

  test("tile artwork actually paints", async ({ page }) => {
    await page.goto("/index.html");
    await page.waitForTimeout(800);
    expect(await canvasIsPainted(page, "#grid .card canvas")).toBe(true);
  });

  test("the hero wordmark paints", async ({ page }) => {
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

  test("nothing scrolls sideways", async ({ page }) => {
    await page.goto("/index.html");
    await page.waitForTimeout(500);
    const { scrollW, clientW } = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    }));
    expect(scrollW).toBeLessThanOrEqual(clientW);
  });

  test("chapter buttons jump to their sections", async ({ page }) => {
    await page.goto("/index.html");
    // the rail is desktop-only; the mobile stand-in is covered in mobile.spec.js
    test.skip(!(await page.locator("#rail").isVisible()), "chapter rail is hidden at this viewport");

    const before = await page.evaluate(() => scrollY);
    await page.locator('#rail .chap[data-id="contact"]').click();
    await page.waitForTimeout(900);
    expect(await page.evaluate(() => scrollY)).toBeGreaterThan(before);
  });
});
