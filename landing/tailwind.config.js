/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        /* The display face: the wordmark and the headline. The design
           called for PODIUM Sharp, which is only available from a font
           CDN that is not reachable from here and would be a third
           request on every load anyway. Archivo is the notebook's own
           display face, it carries a width axis up to 125%, and it is
           self-hosted - so the two pages are set in the same type. */
        podium: ["Archivo", "Archivo Expanded", "Helvetica Neue", "Arial", "sans-serif"],
        inter: ["Inter", "system-ui", "Helvetica Neue", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
