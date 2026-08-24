import { useEffect, useState } from "react";

export interface Typewriter {
  displayed: string;
  done: boolean;
}

/**
 * Reveals `text` one character at a time.
 * @param speed      milliseconds per character
 * @param startDelay milliseconds to wait before the first character
 */
export function useTypewriter(
  text: string,
  speed = 38,
  startDelay = 600
): Typewriter {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);

    let i = 0;
    let interval: number | undefined;

    const timeout = window.setTimeout(() => {
      interval = window.setInterval(() => {
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          window.clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(timeout);
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}
