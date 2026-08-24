import { BRAND } from "../brand";

/**
 * The band under the hero. The list is rendered twice and the strip is
 * translated by exactly half its width, so the loop closes on itself
 * with no gap and no jump. `aria-hidden` because it is the same six
 * words the rest of the page already says.
 */
export default function Ticker() {
  const run = [...BRAND.ticker, ...BRAND.ticker];

  return (
    <div
      aria-hidden="true"
      className="relative z-10 overflow-hidden border-y border-white/10 bg-black py-4 sm:py-5"
    >
      <div className="animate-ticker flex w-max items-center">
        {run.map((word, i) => (
          <span key={i} className="flex items-center">
            <span className="whitespace-nowrap px-6 font-podium text-lg font-extrabold uppercase tracking-wider text-white sm:px-9 sm:text-2xl">
              {word}
            </span>
            <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-crimson-bright" />
          </span>
        ))}
      </div>
    </div>
  );
}
