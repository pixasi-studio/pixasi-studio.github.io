const { test, expect } = require("@playwright/test");
const { visibleCards } = require("./helpers");

test.beforeEach(async ({ page }) => {
  await page.goto("/index.html");
  await page.waitForTimeout(300);
});

test.describe("filters", () => {
  test("'All' shows every tile", async ({ page }) => {
    await page.click('.filters button[data-f="all"]');
    await expect(visibleCards(page)).toHaveCount(6);
  });

  for (const cat of ["film", "motion", "tech"]) {
    test(`'${cat}' shows only ${cat} tiles`, async ({ page }) => {
      await page.click(`.filters button[data-f="${cat}"]`);
      const shown = await visibleCards(page).evaluateAll((els) => els.map((e) => e.dataset.cat));
      expect(shown.length).toBeGreaterThan(0);
      expect(new Set(shown)).toEqual(new Set([cat]));
    });
  }

  test("hidden tiles are genuinely not rendered", async ({ page }) => {
    /* The filter works by setting [hidden], which only wins because
       `.card[hidden]{display:none}` overrides `.card{display:flex}`.
       Delete that one CSS rule and filtering silently stops working with no
       error anywhere — so assert the computed result, not the attribute. */
    await page.click('.filters button[data-f="tech"]');
    const hidden = page.locator("#grid .card[hidden]");
    expect(await hidden.count()).toBeGreaterThan(0);

    const displays = await hidden.evaluateAll((els) => els.map((e) => getComputedStyle(e).display));
    expect(new Set(displays)).toEqual(new Set(["none"]));
    await expect(hidden.first()).toBeHidden();
  });

  test("switching filters is not cumulative", async ({ page }) => {
    await page.click('.filters button[data-f="film"]');
    const film = await visibleCards(page).count();
    await page.click('.filters button[data-f="tech"]');
    await page.click('.filters button[data-f="film"]');
    expect(await visibleCards(page).count()).toBe(film);
  });

  test("the active filter is exposed to assistive tech, not just styled", async ({ page }) => {
    await page.click('.filters button[data-f="motion"]');
    const state = await page.locator(".filters button").evaluateAll((els) =>
      els.map((e) => ({ f: e.dataset.f, pressed: e.getAttribute("aria-pressed"), on: e.classList.contains("on") }))
    );
    for (const s of state) {
      expect(s.pressed, `aria-pressed missing on ${s.f}`).toBe(String(s.f === "motion"));
      expect(s.on).toBe(s.f === "motion");
    }
  });

  test("visible tiles keep painting after a filter change", async ({ page }) => {
    await page.click('.filters button[data-f="tech"]');
    await page.waitForTimeout(400);
    const painted = await visibleCards(page)
      .first()
      .locator("canvas")
      .evaluate((cv) => {
        const d = cv.getContext("2d").getImageData(0, 0, cv.width, cv.height).data;
        const f = [d[0], d[1], d[2]];
        for (let i = 0; i < d.length; i += 4) if (d[i] !== f[0] || d[i + 1] !== f[1] || d[i + 2] !== f[2]) return true;
        return false;
      });
    expect(painted).toBe(true);
  });
});

test.describe("grid / list view", () => {
  test("switching to list restyles the grid and updates aria-pressed", async ({ page }) => {
    await page.click("#v-list");
    await expect(page.locator("#grid")).toHaveClass(/as-list/);
    await expect(page.locator("#v-list")).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#v-grid")).toHaveAttribute("aria-pressed", "false");
  });

  test("switching back to grid restores it", async ({ page }) => {
    await page.click("#v-list");
    await page.click("#v-grid");
    await expect(page.locator("#grid")).not.toHaveClass(/as-list/);
    await expect(page.locator("#v-grid")).toHaveAttribute("aria-pressed", "true");
  });

  test("the choice persists across a reload", async ({ page }) => {
    await page.click("#v-list");
    expect(await page.evaluate(() => localStorage.getItem("pixasi-view"))).toBe("list");

    await page.reload();
    await page.waitForTimeout(400);
    await expect(page.locator("#grid")).toHaveClass(/as-list/);
    await expect(page.locator("#v-list")).toHaveAttribute("aria-pressed", "true");
  });

  test("canvases repaint at the new size after a view change", async ({ page }) => {
    await page.waitForTimeout(500);
    const widthBefore = await page.locator("#grid .card canvas").first().evaluate((c) => c.width);
    await page.click("#v-list");
    await page.waitForTimeout(500);
    const widthAfter = await page.locator("#grid .card canvas").first().evaluate((c) => c.width);

    expect(widthAfter).toBeGreaterThan(0);
    expect(widthAfter).not.toBe(widthBefore);
  });

  test("filter and view combine without either resetting the other", async ({ page }) => {
    await page.click("#v-list");
    await page.click('.filters button[data-f="tech"]');
    await expect(page.locator("#grid")).toHaveClass(/as-list/);
    const shown = await visibleCards(page).evaluateAll((els) => els.map((e) => e.dataset.cat));
    expect(new Set(shown)).toEqual(new Set(["tech"]));
  });
});
