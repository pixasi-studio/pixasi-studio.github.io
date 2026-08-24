import { useEffect, useState } from "react";
import { BRAND } from "../brand";
import { useTypewriter } from "../hooks/useTypewriter";

function CopyIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" />
      <rect x="1" y="1" width="7" height="7" rx="1" stroke="currentColor" />
    </svg>
  );
}

export default function Hero() {
  const { displayed, done } = useTypewriter(BRAND.greeting);

  // The pills arrive on their own clock rather than waiting for the
  // sentence to finish typing.
  const [showActions, setShowActions] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setShowActions(true), 400);
    return () => window.clearTimeout(timer);
  }, []);

  const copyEmail = () => {
    void navigator.clipboard?.writeText(BRAND.email);
  };

  const pill =
    "inline-flex items-center justify-center rounded-full px-4 py-[0.3em] mx-[0.2em] mb-[0.4em] text-[13px] whitespace-nowrap sm:px-5 sm:text-[15px] transition-colors duration-200";

  return (
    <section className="relative z-[1] flex h-screen flex-col justify-end overflow-hidden px-5 pb-12 sm:px-8 md:justify-center md:px-10 md:pb-0">
      <div className="relative z-10 max-w-xl">
        {/* out-of-focus intro label */}
        <p
          className="pointer-events-none mb-5 select-none sm:mb-6"
          style={{
            fontSize: "clamp(18px, 4vw, 26px)",
            lineHeight: 1.3,
            fontWeight: 400,
            color: "#000",
            filter: "blur(4px)",
          }}
        >
          {BRAND.introLine1}
          <br />
          {BRAND.introLine2}
        </p>

        {/* typed greeting */}
        <p
          className="mb-5 text-black sm:mb-6"
          style={{
            fontSize: "clamp(18px, 4vw, 26px)",
            lineHeight: 1.35,
            fontWeight: 400,
            minHeight: "54px",
          }}
        >
          {displayed}
          {!done && (
            <span
              aria-hidden="true"
              className="ml-[2px] inline-block h-[1.1em] w-[2px] bg-black align-middle"
              style={{ animation: "blink 1s step-end infinite" }}
            />
          )}
        </p>

        {/* actions */}
        <div
          className="flex flex-wrap gap-y-1"
          style={{
            opacity: showActions ? 1 : 0,
            transform: showActions ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          {BRAND.actions.map((action) => (
            <a
              key={action.label}
              href={action.href}
              className={`${pill} border border-black/10 bg-white text-black hover:bg-black hover:text-white`}
            >
              {action.label}
            </a>
          ))}

          <button
            type="button"
            onClick={copyEmail}
            className={`${pill} gap-2 border border-white bg-transparent text-white hover:bg-white hover:text-black sm:gap-3`}
          >
            <span>
              {BRAND.reach}{" "}
              <span className="underline underline-offset-1">{BRAND.email}</span>
            </span>
            <CopyIcon />
          </button>
        </div>
      </div>
    </section>
  );
}
