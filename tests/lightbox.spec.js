const { test, expect } = require("@playwright/test");
const { canvasIsPainted, visibleCards, openLightboxOnFirstVisible, focusDescriptor } = require("./helpers");

test.beforeEach(async ({ page }) => {
  await page.goto("/index.html");
  await page.waitForTimeout(300);
});

test.describe("opening and closing", () => {
  test("a tile opens the lightbox with its own content", async ({ page }) => {
    const title = await page.locator("#grid .card").first().locator(".t").textContent();
    await openLightboxOnFirstVisible(page);

    await expect(page.locator("#lb-title")).toHaveText(title.trim());
    await expect(page.locator("#lb-desc")).not.toHaveText("");
    await expect(page.locator("#lb-specs div")).toHaveCount(4);
    expect(await page.getAttribute("#lb-open", "href")).toMatch(/^https:\/\/www\.instagram\.com\//);
  });

  test("the lightbox artwork paints", async ({ page }) => {
    await openLightboxOnFirstVisible(page);
    await page.waitForTimeout(500);
    expect(await canvasIsPainted(page, "#lb-canvas")).toBe(true);
  });

  test("Escape closes it", async ({ page }) => {
    await openLightboxOnFirstVisible(page);
    await page.keyboard.press("Escape");
    await expect(page.locator("#lb")).not.toHaveAttribute("open", "");
  });

  test("the close button closes it", async ({ page }) => {
    await openLightboxOnFirstVisible(page);
    await page.click("#lb-close");
    await expect(page.locator("#lb")).not.toHaveAttribute("open", "");
  });

  test("clicking the backdrop closes it but clicking the panel does not", async ({ page }) => {
    await openLightboxOnFirstVisible(page);
    await page.locator(".lb-inner").click({ position: { x: 5, y: 5 } });
    await expect(page.locator("#lb")).toHaveAttribute("open", "");

    await page.locator("#lb").click({ position: { x: 4, y: 4 } });
    await expect(page.locator("#lb")).not.toHaveAttribute("open", "");
  });

  test("body scroll is locked while open and released after", async ({ page }) => {
    await openLightboxOnFirstVisible(page);
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
    await page.keyboard.press("Escape");
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  });
});

test.describe("navigation follows the active filter", () => {
  /* Regression: step() used to walk the whole WORK array, so Next from a
     filtered set landed on tiles the visitor had just filtered away. */

  test("stepping stays inside the filtered set", async ({ page }) => {
    await page.click('.filters button[data-f="tech"]');
    const inScope = await visibleCards(page).locator(".t").allTextContents();
    expect(inScope.length).toBeGreaterThan(0);

    await openLightboxOnFirstVisible(page);

    // walk further than the set is long, so any leak shows up
    const seen = [await page.locator("#lb-title").textContent()];
    for (let i = 0; i < inScope.length + 2; i++) {
      await page.click("#lb-next");
      seen.push(await page.locator("#lb-title").textContent());
    }
    const strays = seen.filter((t) => !inScope.map((s) => s.trim()).includes(t.trim()));
    expect(strays, "lightbox showed tiles outside the active filter").toEqual([]);
  });

  test("stepping backwards stays inside the filtered set", async ({ page }) => {
    await page.click('.filters button[data-f="film"]');
    const inScope = (await visibleCards(page).locator(".t").allTextContents()).map((s) => s.trim());
    await openLightboxOnFirstVisible(page);

    const seen = [];
    for (let i = 0; i < inScope.length + 2; i++) {
      await page.click("#lb-prev");
      seen.push((await page.locator("#lb-title").textContent()).trim());
    }
    expect(seen.filter((t) => !inScope.includes(t))).toEqual([]);
  });

  test("the counter reports position within the filtered set", async ({ page }) => {
    await page.click('.filters button[data-f="tech"]');
    const count = await visibleCards(page).count();
    await openLightboxOnFirstVisible(page);

    const idx = await page.locator("#lb-idx").textContent();
    expect(idx).toMatch(new RegExp(`^01 / ${String(count).padStart(2, "0")}\\b`));
  });

  test("the counter reports the whole set when unfiltered", async ({ page }) => {
    await openLightboxOnFirstVisible(page);
    expect(await page.locator("#lb-idx").textContent()).toMatch(/^01 \/ 06\b/);
  });

  test("navigation wraps around inside the filtered set", async ({ page }) => {
    await page.click('.filters button[data-f="motion"]');
    const n = await visibleCards(page).count();
    await openLightboxOnFirstVisible(page);

    const first = await page.locator("#lb-title").textContent();
    for (let i = 0; i < n; i++) await page.click("#lb-next");
    expect(await page.locator("#lb-title").textContent()).toBe(first);
  });

  test("arrow keys step the same way as the buttons", async ({ page }) => {
    await openLightboxOnFirstVisible(page);
    const first = await page.locator("#lb-title").textContent();

    await page.keyboard.press("ArrowRight");
    const second = await page.locator("#lb-title").textContent();
    expect(second).not.toBe(first);

    await page.keyboard.press("ArrowLeft");
    expect(await page.locator("#lb-title").textContent()).toBe(first);
  });

  test("nav is disabled when the filter leaves a single tile", async ({ page }) => {
    // narrow to one tile by hiding all but one from the page's own filtered set
    const cats = await page.locator("#grid .card").evaluateAll((els) => els.map((e) => e.dataset.cat));
    const solo = cats.find((c) => cats.filter((x) => x === c).length === 1);
    test.skip(!solo, "no category has exactly one tile in the current data");

    await page.click(`.filters button[data-f="${solo}"]`);
    await openLightboxOnFirstVisible(page);
    await expect(page.locator("#lb-next")).toBeDisabled();
    await expect(page.locator("#lb-prev")).toBeDisabled();
  });
});

test.describe("focus is contained while the lightbox is open", () => {
  /* Regression: role=dialog + aria-modal is a promise the browser does not
     keep for a plain <div>. Tab used to walk straight out into the page. */

  test("focus lands on the close button when it opens", async ({ page }) => {
    await openLightboxOnFirstVisible(page);
    expect(await focusDescriptor(page)).toMatchObject({ inLightbox: true, label: "#lb-close" });
  });

  test("Tab never escapes the panel", async ({ page }) => {
    await openLightboxOnFirstVisible(page);
    const escaped = [];
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press("Tab");
      const f = await focusDescriptor(page);
      if (!f.inLightbox) escaped.push(f.label);
    }
    expect(escaped, "focus left the lightbox").toEqual([]);
  });

  test("Shift+Tab never escapes the panel", async ({ page }) => {
    await openLightboxOnFirstVisible(page);
    const escaped = [];
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press("Shift+Tab");
      const f = await focusDescriptor(page);
      if (!f.inLightbox) escaped.push(f.label);
    }
    expect(escaped, "focus left the lightbox backwards").toEqual([]);
  });

  test("Tab cycles rather than dead-ending", async ({ page }) => {
    await openLightboxOnFirstVisible(page);
    const seen = new Set();
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Tab");
      seen.add((await focusDescriptor(page)).label);
    }
    expect(seen.size).toBeGreaterThan(1);
  });

  test("the page behind is inert while open and restored after", async ({ page }) => {
    const behind = "#bar";
    expect(await page.locator(behind).evaluate((e) => e.inert)).toBe(false);

    await openLightboxOnFirstVisible(page);
    expect(await page.locator(behind).evaluate((e) => e.inert)).toBe(true);

    await page.keyboard.press("Escape");
    expect(await page.locator(behind).evaluate((e) => e.inert)).toBe(false);
  });

  test("closing returns focus to the tile that opened it", async ({ page }) => {
    const card = page.locator("#grid .card").nth(2);
    const title = (await card.locator(".t").textContent()).trim();
    await card.click();
    await page.locator("#lb[open]").waitFor();
    await page.keyboard.press("Escape");

    const f = await focusDescriptor(page);
    expect(f.inLightbox).toBe(false);
    expect(f.label).toContain(title);
  });

  test("the background is reachable again after closing", async ({ page }) => {
    await openLightboxOnFirstVisible(page);
    await page.keyboard.press("Escape");
    await page.keyboard.press("Tab");
    expect((await focusDescriptor(page)).inLightbox).toBe(false);
  });
});
