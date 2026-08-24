import { useCallback, useEffect, useRef } from "react";

/**
 * The fullscreen backdrop.
 *
 * The design called for a looping mp4 from a CloudFront bucket. That
 * file is a third party's, on a host this site cannot reach, and it is
 * the thing that failed last time - so the backdrop is drawn instead of
 * filmed. There is no request to fail, no codec to be unsupported and
 * no megabytes to ship; it is a few hundred bytes of arithmetic that
 * fills any viewport at any pixel ratio.
 *
 * It loops on its own, the way the video would have, and pointer or
 * scroll movement pushes it along faster - so moving over the page
 * moves through a drawing being made. If real footage ever turns up,
 * BackgroundVideo.tsx is the same element with a `src`, and a one-line
 * swap in App.tsx.
 *
 * Two things keep the loop cheap enough to leave running on a phone.
 * Everything that never changes - the room, the scrim, the grain, the
 * vignette - is painted once into two plates and blitted, so a frame is
 * two image copies rather than seven full-canvas fills. And it renders
 * at one device pixel per CSS pixel: this is a soft, near-black image
 * where a retina buffer costs four times the fill rate and buys
 * nothing. Together they took a throttled phone from 4fps to a steady
 * cap.
 */

const BASE_TOP = "#1b1a20";
const BASE_BOT = "#0e0e11";
const ACCENT = "184,64,42"; /* the notebook's rust */
const PLOT = "86,132,168";
const LOOP_SECONDS = 44;
const NUDGE = 0.55; /* how far a full-width swipe pushes the loop */
const NARROW = 768;

interface Plates {
  w: number;
  h: number;
  under: HTMLCanvasElement;
  over: HTMLCanvasElement;
}

/** A tile of noise, generated once and repeated. */
function grainTile() {
  const tile = document.createElement("canvas");
  tile.width = tile.height = 128;
  const t = tile.getContext("2d");
  if (!t) return null;
  const img = t.createImageData(128, 128);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = (Math.random() * 255) | 0;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 15;
  }
  t.putImageData(img, 0, 0);
  return tile;
}

/**
 * The two still layers: the room the light moves through, and
 * everything that sits on top of the drawing.
 */
function buildPlates(w: number, h: number): Plates | null {
  const narrow = w < NARROW;

  const under = document.createElement("canvas");
  under.width = w;
  under.height = h;
  const u = under.getContext("2d");
  if (!u) return null;

  const room = u.createLinearGradient(0, 0, 0, h);
  room.addColorStop(0, BASE_TOP);
  room.addColorStop(1, BASE_BOT);
  u.fillStyle = room;
  u.fillRect(0, 0, w, h);

  const over = document.createElement("canvas");
  over.width = w;
  over.height = h;
  const o = over.getContext("2d");
  if (!o) return null;

  /* The design overlays white type straight onto the footage. Rather
     than trust whatever the frame happens to be, the contrast is drawn
     in: the side the copy sits on is held dark, so the text keeps its
     ratio however the loop moves. A phone's copy is the full width, so
     its hold-back is too. */
  const scrim = o.createLinearGradient(0, 0, w, 0);
  if (narrow) {
    scrim.addColorStop(0, "rgba(6,6,9,0.62)");
    scrim.addColorStop(1, "rgba(6,6,9,0.5)");
  } else {
    scrim.addColorStop(0, "rgba(6,6,9,0.72)");
    scrim.addColorStop(0.55, "rgba(6,6,9,0.36)");
    scrim.addColorStop(1, "rgba(6,6,9,0.04)");
  }
  o.fillStyle = scrim;
  o.fillRect(0, 0, w, h);

  const foot = o.createLinearGradient(0, h * 0.55, 0, h);
  foot.addColorStop(0, "rgba(4,4,6,0)");
  foot.addColorStop(1, "rgba(4,4,6,0.55)");
  o.fillStyle = foot;
  o.fillRect(0, h * 0.55, w, h * 0.45);

  const tile = grainTile();
  const pattern = tile && o.createPattern(tile, "repeat");
  if (pattern) {
    o.fillStyle = pattern;
    o.fillRect(0, 0, w, h);
  }

  const v = o.createRadialGradient(
    w / 2,
    h / 2,
    Math.min(w, h) * 0.32,
    w / 2,
    h / 2,
    Math.max(w, h) * 0.8
  );
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(0,0,0,0.45)");
  o.fillStyle = v;
  o.fillRect(0, 0, w, h);

  return { w, h, under, over };
}

export default function Backdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phase = useRef(0); // 0..1, the role currentTime would have played
  const plates = useRef<Plates | null>(null);
  const prevX = useRef<number | null>(null);
  const prevY = useRef<number | null>(null);
  const raf = useRef(0);
  const lastDraw = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = Math.round(canvas.clientWidth);
    const h = Math.round(canvas.clientHeight);
    if (!w || !h) return;

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    const x = canvas.getContext("2d");
    if (!x) return;

    const still = plates.current;
    if (!still || still.w !== w || still.h !== h) {
      plates.current = buildPlates(w, h);
    }
    if (!plates.current) return;

    const narrow = w < NARROW;
    const turn = phase.current * Math.PI * 2;

    x.drawImage(plates.current.under, 0, 0);

    // a key light drifting across the room, warm, well right of the type
    const lx = w * (0.66 + 0.13 * Math.sin(turn));
    const ly = h * (0.3 + 0.12 * Math.cos(turn * 0.7));
    const key = x.createRadialGradient(lx, ly, 0, lx, ly, Math.max(w, h) * 0.78);
    key.addColorStop(0, "rgba(255,231,201,0.26)");
    key.addColorStop(0.4, "rgba(255,231,201,0.09)");
    key.addColorStop(1, "rgba(255,231,201,0)");
    x.fillStyle = key;
    x.fillRect(0, 0, w, h);

    /* A harmonograph, the same figure the notebook draws. On a wide
       screen it is held inside the band to the right of the copy; on a
       phone the copy is the full width, so it sits low, faint, and is
       allowed to run off the edge like a texture. */
    const cx = w * (narrow ? 0.82 : 0.72);
    const cy = h * (narrow ? 0.78 : 0.5);
    const REACH = 1.5; /* the two damped terms reach 1 + 0.46 of R at i = 0 */
    const R = narrow
      ? Math.min(w, h) * 0.3
      : Math.min(Math.min(w, h) * 0.33, (w - cx - 24) / REACH, (h / 2 - 24) / REACH);
    const fade = narrow ? 0.42 : 1;

    /* Frequencies sit close to a 2:3 ratio and drift only slightly, so
       the curve closes into a figure and slowly changes shape. Letting
       them wander further makes a tangle rather than a drawing - which
       is what the first pass at this looked like. */
    const a1 = 2 + 0.05 * Math.sin(turn * 0.5);
    const a2 = 3 + 0.04 * Math.cos(turn * 0.33);
    const b1 = 3 + 0.05 * Math.cos(turn * 0.42);
    const b2 = 2 + 0.04 * Math.sin(turn * 0.27);
    const px = (i: number) => {
      const s = i * 0.055;
      return (
        R * Math.sin(a1 * s + turn) * Math.exp(-0.0016 * i) +
        R * 0.46 * Math.sin(a2 * s) * Math.exp(-0.0024 * i)
      );
    };
    const py = (i: number) => {
      const s = i * 0.055;
      return (
        R * Math.cos(b1 * s) * Math.exp(-0.0016 * i) +
        R * 0.46 * Math.cos(b2 * s + 1.1) * Math.exp(-0.0024 * i)
      );
    };

    const step = narrow ? 3 : 2;
    const trace = (from: number, to: number) => {
      x.beginPath();
      for (let i = from; i < to; i += step) {
        const X = px(i);
        const Y = py(i);
        i === from ? x.moveTo(X, Y) : x.lineTo(X, Y);
      }
      x.stroke();
    };

    x.save();
    x.translate(cx, cy);
    x.lineJoin = "round";
    x.lineCap = "round";

    x.strokeStyle = `rgba(${PLOT},${0.22 * fade})`;
    x.lineWidth = 1;
    trace(0, 2000);

    x.strokeStyle = `rgba(226,222,214,${0.28 * fade})`;
    x.lineWidth = 1.3;
    trace(0, 1500);

    // the pen, at the head of the trace
    const head = 1500;
    x.strokeStyle = `rgba(${ACCENT},${0.85 * fade})`;
    x.lineWidth = 2;
    trace(head - 200, head);
    x.fillStyle = `rgba(${ACCENT},${fade})`;
    x.beginPath();
    x.arc(px(head - 1), py(head - 1), 3.2, 0, Math.PI * 2);
    x.fill();
    x.restore();

    x.drawImage(plates.current.over, 0, 0);
  }, []);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = matchMedia("(pointer: coarse)");
    let running = !reduce.matches;
    let last = performance.now();
    let dirty = true;

    const frame = (now: number) => {
      raf.current = requestAnimationFrame(frame);
      const dt = Math.min(now - last, 250);
      last = now;
      if (running && !document.hidden) {
        phase.current = (phase.current + dt / 1000 / LOOP_SECONDS) % 1;
        dirty = true;
      }
      if (!dirty) return;
      /* A phone spends its frame budget on scrolling, and this is a
         slow drift behind opaque type - half the cadence is not
         visible on it and is half the battery. */
      const minFrame = 1000 / (coarse.matches ? 15 : 24);
      if (now - lastDraw.current < minFrame) return;
      lastDraw.current = now;
      dirty = false;
      draw();
    };
    raf.current = requestAnimationFrame(frame);

    /* Movement pushes the loop forward on top of its own pace, which is
       what made the last backdrop feel hand-driven. It stays live under
       reduced motion, because a person moving the pointer is not the
       page moving by itself. */
    const nudge = (dx: number, dy: number) => {
      phase.current = (phase.current + (dx / innerWidth + dy / innerHeight) * NUDGE + 1) % 1;
      dirty = true;
    };
    const onPointer = (event: PointerEvent) => {
      if (prevX.current === null || prevY.current === null) {
        prevX.current = event.clientX;
        prevY.current = event.clientY;
        return;
      }
      nudge(event.clientX - prevX.current, event.clientY - prevY.current);
      prevX.current = event.clientX;
      prevY.current = event.clientY;
    };
    const onScroll = () => nudge(0, 24);
    const onResize = () => {
      dirty = true;
      lastDraw.current = 0;
    };
    const onMotion = () => {
      running = !reduce.matches;
      dirty = true;
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    reduce.addEventListener("change", onMotion);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      reduce.removeEventListener("change", onMotion);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 h-full w-full"
      style={{ backgroundColor: BASE_BOT }}
    />
  );
}
