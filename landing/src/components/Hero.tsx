import { ArrowUpRight, Award, Crown } from "lucide-react";
import { BRAND } from "../brand";

const H = BRAND.hero;

export default function Hero() {
  return (
    <section
      id="top"
      className="relative z-10 flex min-h-[100svh] flex-col justify-center px-6 pb-16 pt-28 sm:px-10 lg:px-16 lg:pt-32"
    >
      <div>
        {/* tagline */}
        <div className="animate-fade-up mb-6 flex items-center gap-3 lg:mb-8">
          <Crown className="h-4 w-4 shrink-0 text-white/75" aria-hidden="true" />
          <p className="font-inter text-xs uppercase tracking-[0.3em] text-white/75 sm:text-sm">
            {H.tagline}
          </p>
        </div>

        {/* headline */}
        <h1 className="animate-fade-up-delay-1 font-podium font-extrabold uppercase leading-[0.92] tracking-tight text-white">
          {H.heading.map((line) => (
            <span key={line} className="block text-[clamp(2.8rem,8vw,7rem)]">
              {line}
            </span>
          ))}
        </h1>

        {/* subtext */}
        <p className="animate-fade-up-delay-2 mt-6 max-w-md font-inter text-sm leading-relaxed text-white/75 sm:text-base lg:mt-8">
          {H.subtextLine1}
          <br />
          {H.subtextLine2}{" "}
          <strong className="font-semibold text-white">{H.subtextStrong}</strong>
        </p>

        {/* call to action */}
        <div className="animate-fade-up-delay-3 mt-8 flex flex-wrap items-center gap-4 sm:gap-6 lg:mt-10">
          <a
            href={H.action.href}
            className="group inline-flex items-center gap-2 bg-black px-5 py-3 font-inter text-[11px] uppercase tracking-widest text-white transition-colors duration-300 hover:bg-neutral-900 sm:px-7 sm:py-4 sm:text-xs"
          >
            {H.action.label}
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>

          <div className="hidden items-center gap-3 sm:flex">
            <Award className="h-8 w-8 shrink-0 text-white/65" aria-hidden="true" />
            <p className="font-inter text-xs uppercase leading-snug tracking-wider text-white/75">
              {H.badge[0]}
              <br />
              {H.badge[1]}
            </p>
          </div>
        </div>

        {/* the row along the bottom */}
        <dl className="animate-fade-up-delay-4 mt-8 flex flex-wrap gap-6 sm:mt-10 sm:gap-12 lg:mt-14 lg:gap-16">
          {H.stats.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block font-inter text-2xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {stat.value}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-1 block font-inter text-[9px] uppercase tracking-widest text-white/80 sm:text-xs"
                >
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* there is a page below this, so say so */}
      <a
        href="#practice"
        className="animate-fade-in-delay absolute bottom-6 left-6 hidden items-center gap-3 font-inter text-[10px] uppercase tracking-[0.3em] text-white/70 transition-colors hover:text-white sm:left-10 sm:flex lg:left-16"
      >
        <span className="block h-8 w-px bg-white/40" aria-hidden="true" />
        {H.scrollCue}
      </a>
    </section>
  );
}
