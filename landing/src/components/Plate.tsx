import { useCallback, useEffect, useRef } from "react";

/**
 * One plate, drawn rather than photographed - the same language as the
 * backdrop and the notebook. Each is seeded, so a given plate is always
 * the same figure, and it is drawn once on mount and on resize rather
 * than animated: six live canvases on one page is not worth the frame
 * budget when nothing about them moves.
 */

const GROUND = "#12030a";
const RULE = "rgba(255,255,255,0.09)";
const INK = "255,238,236";
const HOT = "224,37,69";

/** mulberry32 - small, fast, and the same sequence for the same seed. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function Plate({ seed, cat }: { seed: number; cat: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const cv = ref.current;
    if (!cv) return;
    const w = Math.round(cv.clientWidth);
    const h = Math.round(cv.clientHeight);
    if (!w || !h) return;
    if (cv.width !== w || cv.height !== h) {
      cv.width = w;
      cv.height = h;
    }
    const x = cv.getContext("2d");
    if (!x) return;
    const r = rng(seed);

    x.fillStyle = GROUND;
    x.fillRect(0, 0, w, h);

    // the ruled ground every plate is drawn on
    x.strokeStyle = RULE;
    x.lineWidth = 1;
    const g = Math.max(14, Math.round(w / 16));
    x.beginPath();
    for (let i = g; i < w; i += g) {
      x.moveTo(i + 0.5, 0);
      x.lineTo(i + 0.5, h);
    }
    for (let i = g; i < h; i += g) {
      x.moveTo(0, i + 0.5);
      x.lineTo(w, i + 0.5);
    }
    x.stroke();

    x.save();
    x.lineJoin = "round";
    x.lineCap = "round";

    if (cat === "film") {
      /* Video: a waveform read across the frame, with the bar the cut
         would land on marked. */
      const mid = h * 0.55;
      x.strokeStyle = `rgba(${INK},0.5)`;
      x.lineWidth = 1.4;
      x.beginPath();
      for (let i = 0; i <= w; i += 2) {
        const t = i / w;
        const a =
          Math.sin(t * 9 + seed) * 0.45 +
          Math.sin(t * 23 + seed * 1.7) * 0.3 +
          Math.sin(t * 41 + seed * 0.4) * 0.18;
        const y = mid - a * h * 0.3 * (0.5 + r() * 0.06 + 0.44);
        i ? x.lineTo(i, y) : x.moveTo(i, y);
      }
      x.stroke();

      x.fillStyle = `rgba(${INK},0.16)`;
      for (let i = 0; i < 5; i++) {
        const bw = w * (0.05 + r() * 0.1);
        x.fillRect(w * (0.05 + r() * 0.85), h * 0.16, bw, h * 0.06);
      }
      const cut = w * (0.42 + r() * 0.24);
      x.strokeStyle = `rgba(${HOT},0.95)`;
      x.lineWidth = 2;
      x.beginPath();
      x.moveTo(cut, h * 0.12);
      x.lineTo(cut, h * 0.86);
      x.stroke();
    } else if (cat === "motion") {
      /* Visuals: a harmonograph, wound down. */
      const cx = w / 2;
      const cy = h * 0.52;
      const R = Math.min(w, h) * 0.34;
      const a1 = 2 + r() * 0.1;
      const b1 = 3 + r() * 0.1;
      const ph = r() * Math.PI * 2;
      const px = (i: number) => R * Math.sin(a1 * i * 0.055 + ph) * Math.exp(-0.0022 * i);
      const py = (i: number) => R * Math.cos(b1 * i * 0.055) * Math.exp(-0.0022 * i);
      x.translate(cx, cy);
      x.strokeStyle = `rgba(${INK},0.42)`;
      x.lineWidth = 1.2;
      x.beginPath();
      for (let i = 0; i < 1500; i += 3) {
        i ? x.lineTo(px(i), py(i)) : x.moveTo(px(i), py(i));
      }
      x.stroke();
      x.fillStyle = `rgb(${HOT})`;
      x.beginPath();
      x.arc(px(1499), py(1499), 3, 0, Math.PI * 2);
      x.fill();
      x.translate(-cx, -cy);
    } else {
      /* Creative tech: a render queue - cells filling, one still going. */
      const cols = 7;
      const rows = 4;
      const pad = Math.min(w, h) * 0.12;
      const cw = (w - pad * 2) / cols;
      const ch = (h - pad * 2) / rows;
      const done = 12 + Math.floor(r() * 9);
      for (let i = 0; i < cols * rows; i++) {
        const cxx = pad + (i % cols) * cw;
        const cyy = pad + Math.floor(i / cols) * ch;
        const box = [cxx + 2, cyy + 2, cw - 5, ch - 5] as const;
        if (i < done) {
          x.fillStyle = `rgba(${INK},0.3)`;
          x.fillRect(...box);
        } else if (i === done) {
          x.fillStyle = `rgba(${HOT},0.9)`;
          x.fillRect(box[0], box[1], (cw - 5) * (0.3 + r() * 0.5), box[3]);
          x.strokeStyle = `rgba(${HOT},0.9)`;
          x.lineWidth = 1;
          x.strokeRect(...box);
        } else {
          x.strokeStyle = `rgba(${INK},0.2)`;
          x.lineWidth = 1;
          x.strokeRect(...box);
        }
      }
    }
    x.restore();

    // the registration tick, bottom left, as on the notebook's plates
    x.strokeStyle = `rgba(${INK},0.35)`;
    x.lineWidth = 1;
    const m = 12;
    const k = 9;
    x.beginPath();
    x.moveTo(m, h - m - k);
    x.lineTo(m, h - m);
    x.lineTo(m + k, h - m);
    x.stroke();

    // grain
    x.save();
    x.globalAlpha = 0.05;
    x.fillStyle = "#fff";
    for (let i = 0; i < (w * h) / 420; i++) {
      x.fillRect((r() * w) | 0, (r() * h) | 0, 1, 1);
    }
    x.restore();
  }, [seed, cat]);

  useEffect(() => {
    draw();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", draw);
      return () => window.removeEventListener("resize", draw);
    }
    const ro = new ResizeObserver(draw);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, [draw]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="block h-full w-full"
      style={{ backgroundColor: GROUND }}
    />
  );
}
