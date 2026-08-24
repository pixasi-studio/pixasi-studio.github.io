import { useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { BRAND } from "../brand";
import Section from "./Section";

const P = BRAND.practice;

export default function Practice() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="practice" index={P.index} eyebrow={P.eyebrow}>
      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <h2 className="font-podium text-[clamp(1.9rem,4.4vw,3.4rem)] font-extrabold uppercase leading-[0.98] tracking-tight text-white">
            {P.heading}
          </h2>
          <p className="mt-7 font-inter text-base leading-relaxed text-white sm:text-lg">
            {P.lead}
          </p>
          {P.body.map((para) => (
            <p key={para} className="mt-5 font-inter text-sm leading-relaxed text-white/75 sm:text-base">
              {para}
            </p>
          ))}
        </div>

        {/* the facts, which pin open one at a time */}
        <dl className="border-t border-white/15">
          {P.facts.map((fact, i) => {
            const isOpen = open === i;
            return (
              <div key={fact.k} className="border-b border-white/15">
                <dt>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-center gap-4 py-4 text-left"
                  >
                    <span className="w-28 shrink-0 font-inter text-[10px] uppercase tracking-[0.25em] text-white/60 sm:w-32">
                      {fact.k}
                    </span>
                    <span className="flex-1 font-inter text-sm text-white sm:text-base">
                      {fact.v}
                    </span>
                    <Plus
                      className={`h-4 w-4 shrink-0 text-crimson-bright transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </dt>
                <dd
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: isOpen ? 240 : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <p className="pb-5 pl-0 font-inter text-sm leading-relaxed text-white/75 sm:pl-32">
                    {fact.d}{" "}
                    {"href" in fact && fact.href && (
                      <a
                        href={fact.href}
                        target={fact.href.startsWith("http") ? "_blank" : undefined}
                        rel={fact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-1 whitespace-nowrap text-crimson-bright underline underline-offset-4 hover:text-white"
                      >
                        {fact.linkLabel}
                        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                      </a>
                    )}
                  </p>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </Section>
  );
}
