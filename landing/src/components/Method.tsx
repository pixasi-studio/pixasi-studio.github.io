import { BRAND } from "../brand";
import Section from "./Section";

const M = BRAND.method;

export default function Method() {
  return (
    <Section id="method" index={M.index} eyebrow={M.eyebrow}>
      <h2 className="max-w-[15ch] font-podium text-[clamp(1.9rem,4.4vw,3.4rem)] font-extrabold uppercase leading-[0.98] tracking-tight text-white">
        {M.heading}
      </h2>
      <p className="mt-5 max-w-2xl font-inter text-sm leading-relaxed text-white/75 sm:text-base">
        {M.lead}
      </p>

      <div className="mt-14 grid gap-px border border-white/12 bg-white/12 md:grid-cols-3">
        {M.items.map((item) => (
          <article key={item.idx} className="group bg-ink p-7 transition-colors duration-300 hover:bg-ink-deep lg:p-9">
            <span
              aria-hidden="true"
              className="font-podium text-4xl font-extrabold text-crimson-bright transition-colors duration-300 group-hover:text-white lg:text-5xl"
            >
              {item.idx}
            </span>
            <h3 className="mt-5 font-podium text-xl font-extrabold uppercase tracking-wide text-white lg:text-2xl">
              {item.t}
            </h3>
            <p className="mt-4 font-inter text-sm leading-relaxed text-white/75">
              {item.d}
            </p>
            <ul className="mt-6 space-y-2 border-t border-white/12 pt-5">
              {item.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 font-inter text-xs text-white/70">
                  <span
                    aria-hidden="true"
                    className="mt-[6px] h-1 w-1 shrink-0 rotate-45 bg-crimson-bright"
                  />
                  {b}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
