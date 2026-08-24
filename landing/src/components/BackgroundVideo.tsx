/**
 * The design's background video, kept as the swap-in for Backdrop.
 *
 * This is not what ships. The URL below is the one the design named: a
 * file in someone else's CloudFront bucket, which this project cannot
 * reach and cannot verify, and which is exactly what failed the last
 * time it was wired up. Backdrop draws the same thing with nothing to
 * fetch, so that is what App.tsx renders.
 *
 * If real footage does turn up - self-hosted next to the fonts, served
 * with byte ranges - point SRC at it and swap this in for Backdrop in
 * App.tsx. Nothing else has to change: it fills the same fixed layer at
 * the same stacking level.
 *
 * `muted` is what makes autoplay legal on iOS and Chrome; without it
 * the element loads and then sits on frame zero. `playsInline` stops
 * iOS taking the video fullscreen on play.
 */

const SRC = "";

export default function BackgroundVideo() {
  if (!SRC) return null;

  return (
    <video
      className="fixed inset-0 -z-10 h-full w-full object-cover"
      src={SRC}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
