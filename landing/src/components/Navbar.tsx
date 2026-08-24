import { useEffect, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { BRAND } from "../brand";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Escape closes it, and the page behind it does not scroll while it is up.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const wordmark =
    "font-podium font-extrabold uppercase tracking-wider text-white";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16 lg:py-7">
        <a href="/" className={`${wordmark} text-xl sm:text-2xl lg:text-3xl`}>
          {BRAND.logo}
        </a>

        <nav className="hidden items-center gap-8 font-inter text-sm uppercase tracking-widest text-white/80 md:flex lg:gap-10">
          {BRAND.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors duration-300 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={BRAND.cta.href}
          className="hidden items-center gap-2 border border-white/30 px-6 py-3 font-inter text-xs uppercase tracking-widest text-white transition-colors duration-300 hover:border-white/60 hover:bg-white/10 md:flex"
        >
          {BRAND.cta.label}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          className="flex flex-col items-end space-y-1.5 md:hidden"
        >
          <span className="block h-0.5 w-6 bg-white" />
          <span className="block h-0.5 w-6 bg-white" />
          <span className="block h-0.5 w-4 bg-white" />
        </button>
      </header>

      {/* `invisible` when closed takes it out of the tab order and off the
          accessibility tree, so nothing behind the overlay is reachable
          while it is up and nothing inside it is reachable while it is not. */}
      <div
        className={`fixed inset-0 z-50 bg-black/95 backdrop-blur-sm transition-all duration-500 md:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 sm:px-10">
          <span className={`${wordmark} text-xl sm:text-2xl`}>{BRAND.logo}</span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="text-white"
          >
            <X className="h-7 w-7" aria-hidden="true" />
          </button>
        </div>

        <div className="flex h-[calc(100%-5rem)] flex-col justify-center gap-6 px-6 sm:px-10">
          {BRAND.links.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-podium text-4xl font-extrabold uppercase text-white sm:text-5xl"
              style={{
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
                transitionDelay: `${i * 80 + 100}ms`,
              }}
            >
              {link.label}
            </a>
          ))}

          <a
            href={BRAND.cta.href}
            onClick={() => setMenuOpen(false)}
            className="mt-4 inline-flex w-fit items-center gap-2 border border-white/30 px-6 py-3 font-inter text-xs uppercase tracking-widest text-white"
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
              transitionDelay: `${BRAND.links.length * 80 + 100}ms`,
            }}
          >
            {BRAND.cta.label}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>

          {/* The address itself, not just a link to it - it is the one
              detail a person is most likely to want to copy by hand. */}
          <p
            className="font-inter text-xs uppercase tracking-widest text-white/50"
            style={{
              opacity: menuOpen ? 1 : 0,
              transition: "opacity 0.5s ease",
              transitionDelay: `${BRAND.links.length * 80 + 180}ms`,
            }}
          >
            {BRAND.email}
          </p>
        </div>
      </div>
    </>
  );
}
