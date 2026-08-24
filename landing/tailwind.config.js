/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* The field, and the two surfaces the long-form content sits on.
           Both are the field with the light taken out of them, so the
           page reads as one material rather than a red banner stapled to
           a black site. */
        crimson: { DEFAULT: "#c61130", bright: "#e02545", deep: "#8a0c20" },
        ink: { DEFAULT: "#150409", deep: "#0c0205", line: "#3a1119" },
      },
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
