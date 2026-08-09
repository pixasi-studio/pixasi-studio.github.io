const { test, expect } = require("@playwright/test");
const { collectErrors, openLightboxOnFirstVisible, focusDescriptor } = require("./helpers");

/* Touch has no hover, so the site swaps in a different mechanism: an
   IntersectionObserver plays whichever tile is centred and marks it `.seen`
   to stand in for :hover. None of that runs on desktop. */

test("boots cleanly on a phone viewport", async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto("/index.html");
  await page.waitForTimeout(1200);
  expect(errors).toEqual([]);
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

test("tapping a tile opens the lightbox", async ({ page }) => {
  await page.goto("/index.html");
  await page.waitForTimeout(500);
  await page.locator("#grid .card").first().tap();
  await expect(page.locator("#lb")).toHaveAttribute("open", "");
});

test("the centred tile gets the hover stand-in", async ({ page }) => {
  await page.goto("/index.html");
  await page.locator("#work").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  expect(await page.locator("#grid .card.seen").count()).toBeGreaterThan(0);
});

test("the centred tile animates without a pointer", async ({ page }) => {
  await page.goto("/index.html");
  await page.locator("#work").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  const scrubs = await page.locator("#grid .card .scrub").evaluateAll((els) =>
    els.map((e) => parseFloat(e.style.width) || 0)
  );
  expect(Math.max(...scrubs), "no tile is playing on a touch device").toBeGreaterThan(0);
});

test("the wordmark canvas is sized for the device pixel ratio", async ({ page }) => {
  await page.goto("/index.html");
  await page.waitForTimeout(800);
  const { w, clientW } = await page.evaluate(() => {
    const cv = document.getElementById("wordmark");
    return { w: cv.width, clientW: cv.clientWidth };
  });
  expect(w).toBeGreaterThan(0);
  // capped at 2x in the source, so never more than double the CSS width
  expect(w).toBeLessThanOrEqual(clientW * 2);
  expect(w).toBeGreaterThanOrEqual(clientW);
});

test("the lightbox still traps focus on touch", async ({ page }) => {
  await page.goto("/index.html");
  await page.waitForTimeout(400);
  await openLightboxOnFirstVisible(page);

  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    expect((await focusDescriptor(page)).inLightbox).toBe(true);
  }
});

test("the mobile progress rail tracks scrolling", async ({ page }) => {
  await page.goto("/index.html");
  await page.waitForTimeout(400);
  const before = await page.locator("#m-fill").evaluate((e) => parseFloat(e.style.width) || 0);

  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  const after = await page.locator("#m-fill").evaluate((e) => parseFloat(e.style.width) || 0);

  expect(after).toBeGreaterThan(before);
  expect(await page.locator("#m-nm").textContent()).not.toBe("");
});
