import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { BRAND } from "../brand";
import Section from "./Section";
import Plate from "./Plate";

const P = BRAND.plates;

export default function Plates() {
  const [filter, setFilter] = useState<string>("all");
  const shown = P.items.filter((it) => filter === "all" || it.cat === filter);

  return (
    <Section id="plates" index={P.index} eyebrow={P.eyebrow} surface="deep">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="font-podium text-[clamp(1.9rem,4.4vw,3.4rem)] font-extrabold uppercase leading-[0.98] tracking-tight text-white">
            {P.heading}
          </h2>
          <p className="mt-5 max-w-xl font-inter text-sm leading-relaxed text-white/75 sm:text-base">
            {P.lead}
          </p>
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter plates by discipline">
          {P.filters.map((f) => {
            const on = filter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                aria-pressed={on}
                className={`border px-4 py-2 font-inter text-[10px] uppercase tracking-widest transition-colors duration-300 ${
                  on
                    ? "border-crimson-bright bg-crimson-bright text-white"
                    : "border-white/25 text-white/75 hover:border-white/60 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {shown.map((item) => (
          <li key={item.no}>
            <a
              href={BRAND.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group block border border-white/12 transition-colors duration-300 hover:border-crimson-bright focus-visible:border-crimson-bright"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Plate seed={item.seed} cat={item.cat} />
                <span className="absolute left-3 top-3 bg-black/70 px-2 py-1 font-inter text-[9px] uppercase tracking-widest text-white">
                  {item.no}
                </span>
                <span className="absolute right-3 top-3 bg-black/70 px-2 py-1 font-inter text-[9px] uppercase tracking-widest text-white/80">
                  {item.format}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 p-5">
                <div>
                  <h3 className="font-podium text-lg font-extrabold uppercase tracking-wide text-white">
                    {item.t}
                  </h3>
                  <p className="mt-1 font-inter text-[10px] uppercase tracking-widest text-crimson-bright">
                    {item.kind}
                  </p>
                  <p className="mt-3 font-inter text-xs leading-relaxed text-white/70">
                    {item.d}
                  </p>
                </div>
                <ArrowUpRight
                  className="mt-1 h-5 w-5 shrink-0 text-white/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                  aria-hidden="true"
                />
              </div>
            </a>
          </li>
        ))}
      </ul>

      {shown.length === 0 && (
        <p className="mt-12 font-inter text-sm text-white/60">{P.empty}</p>
      )}
    </Section>
  );
}
