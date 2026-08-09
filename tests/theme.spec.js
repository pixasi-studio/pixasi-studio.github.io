const { test, expect } = require("@playwright/test");
const { canvasIsPainted } = require("./helpers");

/* Regression: the toggle used to set data-theme and store nothing, so every
   reload threw the visitor's choice away — while the view toggle right next
   to it persisted correctly. */

test.beforeEach(async ({ page }) => {
  await page.goto("/index.html");
  await page.waitForTimeout(300);
});

test("toggling flips the theme", async ({ page }) => {
  const before = await page.evaluate(() => document.documentElement.dataset.theme || null);
  await page.click("#theme");
  const after = await page.evaluate(() => document.documentElement.dataset.theme);
  expect(["dark", "light"]).toContain(after);
  expect(after).not.toBe(before);
});

test("the choice is written to localStorage", async ({ page }) => {
  await page.click("#theme");
  const chosen = await page.evaluate(() => document.documentElement.dataset.theme);
  expect(await page.evaluate(() => localStorage.getItem("pixasi-theme"))).toBe(chosen);
});

test("the choice survives a reload", async ({ page }) => {
  await page.click("#theme");
  const chosen = await page.evaluate(() => document.documentElement.dataset.theme);

  await page.reload();
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe(chosen);
});

test("toggling twice returns to where it started and still persists", async ({ page }) => {
  await page.click("#theme");
  const once = await page.evaluate(() => document.documentElement.dataset.theme);
  await page.click("#theme");
  const twice = await page.evaluate(() => document.documentElement.dataset.theme);

  expect(twice).not.toBe(once);
  await page.reload();
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe(twice);
});

test("the saved theme is applied before first paint, not after", async ({ page }) => {
  await page.click("#theme");
  const chosen = await page.evaluate(() => document.documentElement.dataset.theme);

  // read the attribute at the earliest moment scripts can observe the document
  const seenAtDocumentStart = [];
  await page.exposeFunction("__report", (v) => seenAtDocumentStart.push(v));
  await page.addInitScript(() => {
    document.addEventListener("readystatechange", function once() {
      if (document.readyState === "interactive") {
        document.removeEventListener("readystatechange", once);
        // @ts-ignore
        window.__report(document.documentElement.dataset.theme || "(unset)");
      }
    });
  });

  await page.reload();
  await page.waitForTimeout(500);
  expect(seenAtDocumentStart[0], "theme applied late — visitor sees a flash").toBe(chosen);
});

test("a corrupt stored value is ignored rather than applied", async ({ page }) => {
  await page.evaluate(() => localStorage.setItem("pixasi-theme", "banana"));
  await page.reload();
  await page.waitForTimeout(300);
  const t = await page.evaluate(() => document.documentElement.dataset.theme);
  expect(t === undefined || t === "").toBe(true);
});

test("the site still works when localStorage throws", async ({ page, context }) => {
  await context.addInitScript(() => {
    const boom = () => {
      throw new Error("denied");
    };
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get: () => ({ getItem: boom, setItem: boom, removeItem: boom, key: boom, length: 0 }),
    });
  });

  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/index.html");
  await page.waitForTimeout(500);

  await page.click("#theme");
  expect(["dark", "light"]).toContain(await page.evaluate(() => document.documentElement.dataset.theme));
  expect(errors).toEqual([]);
});

test("artwork repaints for the new theme", async ({ page }) => {
  await page.waitForTimeout(600);
  const before = await page.evaluate(() => {
    const cv = document.querySelector("#grid .card canvas");
    return cv.getContext("2d").getImageData(0, 0, 40, 40).data.join(",");
  });

  await page.click("#theme");
  await page.waitForTimeout(300);
  const after = await page.evaluate(() => {
    const cv = document.querySelector("#grid .card canvas");
    return cv.getContext("2d").getImageData(0, 0, 40, 40).data.join(",");
  });

  expect(after).not.toBe(before);
  expect(await canvasIsPainted(page, "#grid .card canvas")).toBe(true);
});
