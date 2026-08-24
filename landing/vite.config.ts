import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * The landing page is the front page, so it builds to the repo root:
 * `index.html` plus `assets/`. GitHub Pages serves this branch with no
 * build step, so the output has to be committed.
 *
 * `emptyOutDir` is false and must stay false - the out directory is the
 * repository itself, and emptying it would delete the whole project.
 * Stale hashed assets are cleared by the `prebuild` script instead,
 * which only ever removes `../assets`.
 */
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: { outDir: "..", emptyOutDir: false },
});
