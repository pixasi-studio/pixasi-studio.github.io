// @ts-check
const { defineConfig, devices } = require("@playwright/test");

const PORT = 8321;

/* The site is a static file with no build step, so the "server" is just
   python3 handing out the repo root — same thing the README tells a human
   to run. */
module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],

  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  webServer: {
    command: `python3 -m http.server ${PORT}`,
    url: `http://127.0.0.1:${PORT}/index.html`,
    reuseExistingServer: !process.env.CI,
    stdout: "ignore",
  },

  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } },
      testIgnore: ["**/mobile.spec.js", "**/reduced-motion.spec.js"],
    },
    {
      // hover does not exist here, so the site takes a different code path:
      // IntersectionObserver drives playback and `.seen` stands in for :hover
      name: "mobile",
      use: { ...devices["Pixel 5"] },
      testMatch: ["**/mobile.spec.js", "**/smoke.spec.js"],
    },
    {
      // every animation path is meant to be skipped, but the artwork must
      // still paint a static first frame
      name: "reduced-motion",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" },
      testMatch: ["**/reduced-motion.spec.js"],
    },
  ],
});
