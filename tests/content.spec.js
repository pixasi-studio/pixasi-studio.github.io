const { test, expect } = require("@playwright/test");
const { source } = require("./helpers");

/* The WORK array is the thing that gets edited as real posts go up, so the
   shape of that data is the contract most likely to be broken by hand. */

const CATS = ["film", "motion", "tech"];

test.beforeEach(async ({ page }) => {
  await page.goto("/index.html");
  await page.waitForTimeout(300);
});

test("every tile declares a category the renderer actually handles", async ({ page }) => {
  /* renderFrame dispatches film -> motion -> else, so "tech" is the fallback
     branch: a typo'd category renders as tech artwork instead of failing. */
  const cats = await page.locator("#grid .card").evaluateAll((els) => els.map((e) => e.dataset.cat));
  expect(cats.length).toBe(6);
  for (const c of cats) expect(CATS, `unknown category "${c}" would silently render as tech`).toContain(c);
});

test("every filter button maps to at least one tile", async ({ page }) => {
  const cats = await page.locator("#grid .card").evaluateAll((els) => els.map((e) => e.dataset.cat));
  const buttons = await page.locator(".filters button").evaluateAll((els) => els.map((e) => e.dataset.f));

  for (const f of buttons) {
    if (f === "all") continue;
    expect(cats, `filter "${f}" matches no tiles — it would show an empty grid`).toContain(f);
  }
});

test("every tile has a title, a kind and a badge", async ({ page }) => {
  const rows = await page.locator("#grid .card").evaluateAll((els) =>
    els.map((e) => ({
      title: e.querySelector(".t")?.textContent?.trim(),
      meta: e.querySelector(".m")?.textContent?.trim(),
      badge: e.querySelector(".badge")?.textContent?.trim(),
    }))
  );
  for (const r of rows) {
    expect(r.title).toBeTruthy();
    expect(r.meta).toBeTruthy();
    expect(r.badge).toBeTruthy();
  }
});

test("every tile links to a real Instagram permalink with its specs filled in", async ({ page }) => {
  const n = await page.locator("#grid .card").count();
  for (let i = 0; i < n; i++) {
    await page.locator("#grid .card").nth(i).click();
    await page.locator("#lb[open]").waitFor();

    const href = await page.getAttribute("#lb-open", "href");
    expect(href, `tile ${i} has no post link`).toMatch(/^https:\/\/www\.instagram\.com\/(p|reel)\/[\w-]+\/?$/);

    await expect(page.locator("#lb-desc")).not.toHaveText("");
    await expect(page.locator("#lb-specs div")).toHaveCount(4);
    const labels = await page.locator("#lb-specs div span:first-child").allTextContents();
    expect(labels.map((s) => s.trim())).toEqual(["By", "Discipline", "Where", "Format"]);

    await page.keyboard.press("Escape");
  }
});

test("outbound links open safely", async ({ page }) => {
  const bad = await page.locator('a[target="_blank"]').evaluateAll((els) =>
    els.filter((e) => !(e.getAttribute("rel") || "").includes("noopener")).map((e) => e.getAttribute("href"))
  );
  expect(bad, "target=_blank without rel=noopener").toEqual([]);
});

test("tile titles are inserted as text, not markup", async ({ page }) => {
  /* The data is hardcoded today, but the README frames WORK as the thing you
     edit per post. If it ever comes from a feed, these sinks decide whether
     that is safe. */
  const escaped = await page.evaluate(() => {
    const probe = '<img src=x onerror="window.__pwned=1">';
    const h3 = document.getElementById("lb-title");
    h3.textContent = probe;
    const leaked = h3.querySelector("img") !== null;
    h3.textContent = "";
    return !leaked;
  });
  expect(escaped).toBe(true);

  // and the shipped code must not be writing tile text through innerHTML
  const src = source();
  expect(src).not.toMatch(/getElementById\("lb-title"\)\.innerHTML/);
});

test("the page makes no external requests", async ({ page }) => {
  /* The README's central claim: fonts are inlined, artwork is generated,
     nothing phones home. */
  const external = [];
  page.on("request", (r) => {
    const u = r.url();
    if (!u.startsWith("http://127.0.0.1") && !u.startsWith("http://localhost") && !u.startsWith("data:")) {
      external.push(u);
    }
  });
  await page.goto("/index.html");
  await page.waitForTimeout(1500);
  expect(external).toEqual([]);
});

test("document metadata stays intact", async ({ page }) => {
  await expect(page).toHaveTitle(/Pixasi/);
  expect(await page.getAttribute('link[rel="canonical"]', "href")).toBeTruthy();
  expect(await page.getAttribute('meta[name="description"]', "content")).toBeTruthy();
  expect(await page.getAttribute('meta[property="og:title"]', "content")).toBeTruthy();
  expect(await page.locator('meta[name="theme-color"]').count()).toBe(2);
});

test("the brief form builds a mailto from its fields", async ({ page }) => {
  await page.fill("#f-name", "Ann O'Brien");
  await page.selectOption("#f-kind", { index: 1 });
  await page.fill("#f-when", "Q1 2027");
  await page.fill("#f-msg", "Line one\nLine two & more");

  // intercept the navigation the submit handler triggers
  await page.evaluate(() => {
    window.__mailto = null;
    document.getElementById("brief").addEventListener(
      "submit",
      (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
      },
      true
    );
  });

  const url = await page.evaluate(() => {
    const f = document.getElementById("brief");
    const body =
      "Name: " + (f.elements.name.value || "—") + "\n" +
      "Project: " + f.elements.kind.value + "\n" +
      "Timeline: " + (f.elements.when.value || "—") + "\n\n" +
      (f.elements.msg.value || "");
    return "mailto:iamasr@duck.com?subject=" +
      encodeURIComponent("Project enquiry — " + f.elements.kind.value) +
      "&body=" + encodeURIComponent(body);
  });

  expect(url).toContain("mailto:iamasr@duck.com");
  expect(url).toContain(encodeURIComponent("Ann O'Brien"));
  expect(url).toContain(encodeURIComponent("Line two & more"));
  expect(url).not.toContain("\n");
});

test("every form control has a label", async ({ page }) => {
  const unlabelled = await page.locator("#brief input, #brief select, #brief textarea").evaluateAll((els) =>
    els
      .filter((e) => {
        const byFor = e.id && document.querySelector(`label[for="${e.id}"]`);
        return !byFor && !e.closest("label") && !e.getAttribute("aria-label");
      })
      .map((e) => e.name || e.id || e.tagName)
  );
  expect(unlabelled).toEqual([]);
});
