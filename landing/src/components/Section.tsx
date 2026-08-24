import type { ReactNode } from "react";
import { useInView } from "../hooks/useInView";

interface Props {
  id: string;
  index: string;
  eyebrow: string;
  surface?: "ink" | "deep";
  children: ReactNode;
}

/**
 * One numbered entry. The rule and the number are the notebook's, and
 * the whole block reveals once when you reach it.
 */
export default function Section({ id, index, eyebrow, surface = "ink", children }: Props) {
  const { ref, seen } = useInView<HTMLElement>();

  return (
    <section
      id={id}
      ref={ref}
      className={`relative z-10 px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-32 ${
        surface === "deep" ? "bg-ink-deep" : "bg-ink"
      }`}
    >
      <div className="reveal mx-auto max-w-6xl" data-in={seen}>
        <p className="mb-10 flex items-center gap-4 font-inter text-[10px] uppercase tracking-[0.3em] text-white/60 sm:mb-14">
          <span className="font-bold text-crimson-bright">{index}</span>
          <span>{eyebrow}</span>
          <span className="h-px flex-1 bg-white/15" aria-hidden="true" />
        </p>
        {children}
      </div>
    </section>
  );
}
