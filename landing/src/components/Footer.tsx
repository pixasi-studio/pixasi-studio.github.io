import { ArrowUpRight } from "lucide-react";
import { BRAND } from "../brand";

const F = BRAND.footer;

export default function Footer() {
  return (
    <footer className="relative z-10 bg-black px-6 py-14 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <a
              href="#top"
              className="font-podium text-2xl font-extrabold uppercase tracking-wider text-white sm:text-3xl"
            >
              {BRAND.logo}
            </a>
            <p className="mt-4 max-w-xs font-inter text-sm leading-relaxed text-white/70">
              {F.line}
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {BRAND.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-inter text-[11px] uppercase tracking-widest text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* the notebook is still its own page, and still worth finding */}
          <a
            href={BRAND.notebook}
            className="group block max-w-xs border border-white/20 p-5 transition-colors duration-300 hover:border-crimson-bright"
          >
            <span className="flex items-center gap-2 font-inter text-[11px] uppercase tracking-widest text-white">
              {F.notebook}
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
            <span className="mt-2 block font-inter text-xs leading-relaxed text-white/70">
              {F.notebookNote}
            </span>
          </a>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-inter text-[11px] uppercase tracking-widest text-white/60">
            {BRAND.name} · {F.rights}
          </p>
          <a
            href="#top"
            className="font-inter text-[11px] uppercase tracking-widest text-white/60 transition-colors hover:text-white"
          >
            {F.top}
          </a>
        </div>
      </div>
    </footer>
  );
}
