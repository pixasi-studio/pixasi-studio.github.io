import { useEffect, useRef } from "react";

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4";

const SENSITIVITY = 0.8;

/**
 * Full-screen backdrop that never plays on its own: horizontal mouse
 * movement scrubs it forward and backward.
 *
 * Seeks are serialised. Assigning `currentTime` while a seek is already in
 * flight floods the decoder and the video stalls, so a new seek is only
 * issued once the last one has reported back, and `seeked` re-checks the
 * target in case the mouse kept moving in the meantime.
 */
export default function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTime = useRef(0);
  const requestedTime = useRef<number | null>(null);
  const seeking = useRef(false);
  const prevX = useRef<number | null>(null);

  // Only ever touches refs, so the copy captured by the effect stays correct.
  const requestSeek = () => {
    const video = videoRef.current;
    if (!video || seeking.current) return;

    const duration = video.duration;
    if (!duration || !Number.isFinite(duration)) return;

    // Compare against the target we last asked for, not against currentTime.
    // If the mouse has not moved since, there is nothing new to seek to and
    // we stop. Comparing to currentTime instead spins forever whenever the
    // target cannot be reached - an unseekable source, or a clamp at either
    // end - because the gap never closes.
    if (
      requestedTime.current !== null &&
      Math.abs(targetTime.current - requestedTime.current) < 0.001
    ) {
      return;
    }

    seeking.current = true;
    requestedTime.current = targetTime.current;
    video.currentTime = targetTime.current;
  };

  const handleSeeked = () => {
    seeking.current = false;
    requestSeek();
  };

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      const video = videoRef.current;
      if (!video) return;

      const duration = video.duration;
      if (!duration || !Number.isFinite(duration)) return;

      // First move only establishes an origin - there is no delta yet.
      if (prevX.current === null) {
        prevX.current = event.clientX;
        return;
      }

      const delta = event.clientX - prevX.current;
      prevX.current = event.clientX;

      const offset = (delta / window.innerWidth) * SENSITIVITY * duration;
      targetTime.current = Math.min(
        duration,
        Math.max(0, targetTime.current + offset)
      );

      requestSeek();
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <video
      ref={videoRef}
      src={VIDEO_SRC}
      muted
      playsInline
      preload="auto"
      onSeeked={handleSeeked}
      className="fixed inset-0 z-0 h-full w-full object-cover"
      style={{ objectPosition: "70% center" }}
    />
  );
}
