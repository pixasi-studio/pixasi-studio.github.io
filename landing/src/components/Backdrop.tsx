import { useCallback, useEffect, useRef } from "react";

/**
 * The full-screen backdrop, scrubbed by horizontal mouse movement rather
 * than played.
 *
 * It is drawn rather than filmed. The original design used a hosted mp4,
 * which could not be relied on: it is a third party's file on a third
 * party's CDN, and re-encoding a replacement here produced VP9 inside an
 * MP4 - unplayable on iOS - in a fragmented container that reported the
 * wrong duration and refused to seek at all.
 *
 * Drawing it removes every one of those problems. There is no request to
 * fail, no codec to be unsupported, no byte ranges to negotiate, and the
 * position is a number rather than a decoder state, so it scrubs exactly
 * and instantly at any point. It also weighs a few hundred bytes instead
 * of megabytes, and matches the notebook, which is drawn the same way.
 *
 * To use real footage instead, see BackgroundVideo.tsx - it takes the
 * same input and is a one-line swap in App.tsx.
 */

const SENSITIVITY = 0.8;
const WALL_TOP = "#d8d5cf";
const WALL_BOT = "#bdb9b2";
const INK = "30,28,25";
const ACCENT = "184,64,42";
const PLOT = "46,99,137";

export default function Backdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phase = useRef(0); // 0..1, the same role currentTime played
  const prevX = useRef<number | null>(null);
  const queued = useRef(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;

    const nw = Math.round(w * dpr);
    const nh = Math.round(h * dpr);
    if (canvas.width !== nw || canvas.height !== nh) {
      canvas.width = nw;
      canvas.height = nh;
    }
    const x = canvas.getContext("2d");
    if (!x) return;
    x.setTransform(dpr, 0, 0, dpr, 0, 0);

    const t = phase.current;

    // the wall
    const g = x.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, WALL_TOP);
    g.addColorStop(1, WALL_BOT);
    x.fillStyle = g;
    x.fillRect(0, 0, w, h);

    // light from the upper left, so the type on that side stays readable
    const lg = x.createRadialGradient(w * 0.18, h * 0.05, 0, w * 0.18, h * 0.05, w * 0.85);
    lg.addColorStop(0, "rgba(255,253,248,0.55)");
    lg.addColorStop(1, "rgba(255,253,248,0)");
    x.fillStyle = lg;
    x.fillRect(0, 0, w, h);

    /* A harmonograph whose parameters drift with the scrub, so moving the
       mouse moves through a drawing being made rather than a loop. Sits
       right of centre, where the reference framed its subject. */
    const cx = w * 0.68;
    const cy = h * 0.52;
    const R = Math.min(w, h) * 0.31;
    const a1 = 2.02 + 0.6 * Math.sin(t * Math.PI * 2 * 0.5);
    const a2 = 3.01 + 0.5 * Math.cos(t * Math.PI * 2 * 0.33);
    const b1 = 1.99 + 0.4 * Math.cos(t * Math.PI * 2 * 0.42);
    const b2 = 3.04 + 0.6 * Math.sin(t * Math.PI * 2 * 0.27);
    const ph = t * Math.PI * 2;
    const px = (i: number) => {
      const s = i * 0.055;
      return (
        R * Math.sin(a1 * s + ph) * Math.exp(-0.0021 * i) +
        R * 0.46 * Math.sin(a2 * s) * Math.exp(-0.0031 * i)
      );
    };
    const py = (i: number) => {
      const s = i * 0.055;
      return (
        R * Math.cos(b1 * s) * Math.exp(-0.0021 * i) +
        R * 0.46 * Math.cos(b2 * s + 1.1) * Math.exp(-0.0031 * i)
      );
    };

    x.save();
    x.translate(cx, cy);
    x.lineJoin = "round";
    x.lineCap = "round";

    x.strokeStyle = `rgba(${PLOT},0.34)`;
    x.lineWidth = 1;
    x.beginPath();
    for (let i = 0; i < 2000; i += 2) {
      const X = px(i), Y = py(i);
      i ? x.lineTo(X, Y) : x.moveTo(X, Y);
    }
    x.stroke();

    x.strokeStyle = `rgba(${INK},0.62)`;
    x.lineWidth = 1.4;
    x.beginPath();
    for (let i = 0; i < 1500; i += 2) {
      const X = px(i), Y = py(i);
      i ? x.lineTo(X, Y) : x.moveTo(X, Y);
    }
    x.stroke();

    // the pen itself, at the head of the trace
    const head = 1500;
    x.strokeStyle = `rgba(${ACCENT},0.95)`;
    x.lineWidth = 2;
    x.beginPath();
    for (let i = head - 200; i < head; i += 2) {
      const X = px(i), Y = py(i);
      i === head - 200 ? x.moveTo(X, Y) : x.lineTo(X, Y);
    }
    x.stroke();
    x.fillStyle = `rgb(${ACCENT})`;
    x.beginPath();
    x.arc(px(head - 1), py(head - 1), 3.4, 0, Math.PI * 2);
    x.fill();
    x.restore();

    // registration ticks, as on the notebook's plates
    x.strokeStyle = `rgba(${INK},0.30)`;
    x.lineWidth = 1;
    const m = 34, k = 16;
    ([[m, h - m, 1, -1], [w - m, h - m, -1, -1]] as const)
      .forEach(([ax, ay, sx, sy]) => {
        x.beginPath();
        x.moveTo(ax, ay + sy * k);
        x.lineTo(ax, ay);
        x.lineTo(ax + sx * k, ay);
        x.stroke();
      });

    // grain, then a printed vignette
    x.save();
    x.globalAlpha = 0.05;
    x.fillStyle = "#000";
    const grains = Math.floor((w * h) / 340);
    for (let i = 0; i < grains; i++) {
      x.fillRect((Math.random() * w) | 0, (Math.random() * h) | 0, 1, 1);
    }
    x.restore();

    const v = x.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.34, w / 2, h / 2, Math.max(w, h) * 0.78);
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, "rgba(40,36,30,0.22)");
    x.fillStyle = v;
    x.fillRect(0, 0, w, h);
  }, []);

  // one draw per frame at most, however many events arrive
  const schedule = useCallback(() => {
    if (queued.current) return;
    queued.current = true;
    requestAnimationFrame(() => {
      queued.current = false;
      draw();
    });
  }, [draw]);

  useEffect(() => {
    draw();

    const onMouseMove = (event: MouseEvent) => {
      if (prevX.current === null) {
        prevX.current = event.clientX;
        return;
      }
      const delta = event.clientX - prevX.current;
      prevX.current = event.clientX;
      phase.current = Math.min(1, Math.max(0, phase.current + (delta / innerWidth) * SENSITIVITY));
      schedule();
    };
    const onResize = () => schedule();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
    };
  }, [draw, schedule]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 h-full w-full"
      style={{ backgroundColor: WALL_BOT }}
    />
  );
}
