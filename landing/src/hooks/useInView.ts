import { useEffect, useRef, useState } from "react";

/**
 * True once the element has come into view, and true from then on -
 * things settle where they land rather than replaying every time you
 * scroll back past them.
 */
export function useInView<T extends HTMLElement>(margin = "0px 0px -12% 0px") {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: margin, threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  return { ref, seen };
}

/** Which section the page is currently sitting in, for the navbar. */
export function useCurrentSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length || typeof IntersectionObserver === "undefined") return;

    /* The band is the middle of the viewport, so a section counts as
       current when it is what you are actually looking at rather than
       when its top edge clips the navbar. */
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  return active;
}
