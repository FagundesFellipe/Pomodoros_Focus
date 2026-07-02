"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

interface CountdownOverlayProps {
  /** Fired once the countdown reaches zero. Must be stable (useCallback). */
  onComplete: () => void;
  /** Seconds to count down from. Defaults to 3 (section 10.7.4). */
  from?: number;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );
}

/**
 * Full-screen 3-2-1 countdown shown before the first block starts. Blocks all
 * interaction with the page underneath, announces each number for screen
 * readers, and disables its scale/fade animation when the user prefers reduced
 * motion (section 10.7.4).
 */
export default function CountdownOverlay({
  onComplete,
  from = 3,
}: CountdownOverlayProps) {
  const [count, setCount] = useState(from);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (count <= 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setCount((current) => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, onComplete]);

  // Nothing to render once we hit zero; the parent transitions away.
  if (count <= 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Starting session"
    >
      <span
        key={count}
        aria-live="assertive"
        className={
          "font-display text-[8rem] leading-none text-primary sm:text-[12rem] " +
          (reducedMotion ? "" : "animate-in fade-in-0 zoom-in-95 duration-300")
        }
      >
        {count}
      </span>
    </div>
  );
}
