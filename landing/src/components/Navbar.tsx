import { useEffect, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { BRAND } from "../brand";
import { useCurrentSection } from "../hooks/useInView";

const IDS = BRAND.links.map((l) => l.href.slice(1));

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useCurrentSection(IDS);

  /* Over the hero the bar floats on the field; past it there is content
     underneath, so it takes a ground of its own. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.72);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes the menu, and the page behind it does not scroll while it is up.
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

  const wordmark = "font-podium font-extrabold uppercase tracking-wider text-white";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 transition-colors duration-500 sm:px-10 lg:px-16 lg:py-7 ${
          scrolled ? "bg-black/85 backdrop-blur-md lg:py-5" : ""
        }`}
      >
        <a href="#top" className={`${wordmark} text-xl sm:text-2xl lg:text-3xl`}>
          {BRAND.logo}
        </a>

        <nav className="hidden items-center gap-8 font-inter text-sm uppercase tracking-widest md:flex lg:gap-10">
          {BRAND.links.map((link) => {
            const on = active === link.href.slice(1);
            return (
              <a
                key={link.label}
                href={link.href}
                aria-current={on ? "true" : undefined}
                className={`relative py-1 transition-colors duration-300 hover:text-white ${
                  on ? "text-white" : "text-white/80"
                }`}
              >
                {link.label}
                {/* one mark that slides, rather than four that light up */}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-0.5 left-0 h-px bg-crimson-bright transition-all duration-300 ${
                    on ? "w-full opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </a>
            );
          })}
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

        <div className="flex h-[calc(100%-5rem)] flex-col px-6 pb-6 sm:px-10">
          <div className="my-auto flex flex-col gap-6">
          {BRAND.links.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-podium text-4xl font-extrabold uppercase tracking-tight text-white transition-colors hover:text-white/70 sm:text-5xl"
              style={{
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
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
              transition: "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              transitionDelay: `${BRAND.links.length * 80 + 100}ms`,
            }}
          >
            {BRAND.cta.label}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>

          {/* The address itself, not just a link to it - it is the one
              detail a person is most likely to want to copy by hand. */}
          <p
            className="font-inter text-xs uppercase tracking-widest text-white/70"
            style={{
              opacity: menuOpen ? 1 : 0,
              transition: "opacity 0.5s ease",
              transitionDelay: `${BRAND.links.length * 80 + 180}ms`,
            }}
          >
            {BRAND.email}
          </p>
          </div>

          <div className="flex items-center justify-between border-t border-white/15 pt-5 font-inter text-[10px] uppercase tracking-widest text-white/60">
            <span>{BRAND.menuFoot}</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </>
  );
}
