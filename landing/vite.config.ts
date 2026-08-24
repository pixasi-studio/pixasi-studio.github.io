import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Built output lands in ../hero so GitHub Pages can serve it at /hero/
// without a build step in CI. Change `base` if you move it.
export default defineConfig({
  plugins: [react()],
  base: "/hero/",
  build: { outDir: "../hero", emptyOutDir: true },
});
