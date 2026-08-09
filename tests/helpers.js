const fs = require("fs");
const path = require("path");

const INDEX = path.join(__dirname, "..", "index.html");

function source() {
  return fs.readFileSync(INDEX, "utf8");
}

/** Every id the script looks up via getElementById, read out of the source.
 *  Keeps the DOM-contract test honest as the script grows. */
function referencedIds(src = source()) {
  return [...new Set([...src.matchAll(/getElementById\("([^"]+)"\)/g)].map((m) => m[1]))];
}

/** Attach console/pageerror collectors. Call before goto. */
function collectErrors(page) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console.error: ${m.text()}`);
  });
  return errors;
}

/** True when a canvas has more than one distinct RGB value, i.e. something
 *  was actually drawn rather than a flat fill or nothing at all. */
async function canvasIsPainted(page, selector) {
  return page.evaluate((sel) => {
    const cv = document.querySelector(sel);
    if (!cv) return "missing";
    if (!cv.width || !cv.height) return "zero-sized";
    const d = cv.getContext("2d").getImageData(0, 0, cv.width, cv.height).data;
    const f = [d[0], d[1], d[2]];
    for (let i = 0; i < d.length; i += 4) {
      if (d[i] !== f[0] || d[i + 1] !== f[1] || d[i + 2] !== f[2]) return true;
    }
    return false;
  }, selector);
}

/** Titles of the tiles currently on screen, in DOM order. */
function visibleCards(page) {
  return page.locator("#grid .card:not([hidden])");
}

async function openLightboxOnFirstVisible(page) {
  await visibleCards(page).first().click();
  await page.locator("#lb[open]").waitFor();
}

/** Where focus is right now, and whether it escaped the lightbox. */
function focusDescriptor(page) {
  return page.evaluate(() => {
    const a = document.activeElement;
    if (!a) return { inLightbox: false, label: "(none)" };
    return {
      inLightbox: !!a.closest("#lb"),
      label: (a.id && "#" + a.id) || a.tagName + ":" + (a.textContent || "").trim().slice(0, 20),
    };
  });
}

module.exports = {
  INDEX,
  source,
  referencedIds,
  collectErrors,
  canvasIsPainted,
  visibleCards,
  openLightboxOnFirstVisible,
  focusDescriptor,
};
