import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';

// ── Shared singleton ──────────────────────────────────────────
// Lenis hijacks native scroll, so `document.body.style.overflow = 'hidden'`
// alone does NOT stop it (the modal would still let the page scroll behind
// the backdrop). Any component that needs to lock scrolling — like the
// TikTok lightbox — must call the real `lenis.stop()` / `lenis.start()`
// API. We keep one live instance here and let consumers subscribe to it.
let sharedLenis: Lenis | null = null;
const listeners = new Set<(instance: Lenis | null) => void>();

function setSharedLenis(instance: Lenis | null) {
  sharedLenis = instance;
  listeners.forEach((fn) => fn(instance));
}

/**
 * Initializes the single Lenis instance for the whole app smooth-scroll.
 * Should be mounted once, near the root (e.g. in the Portfolio page).
 */
export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;
    setSharedLenis(lenis);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      setSharedLenis(null);
    };
  }, []);

  return lenisRef.current;
}

/**
 * Lets any component (e.g. a modal/lightbox) read & react to the shared
 * Lenis instance, so it can call `.stop()` / `.start()` to properly lock
 * scrolling without fighting the library's own scroll hijacking.
 */
export function useLenisInstance() {
  const [instance, setInstance] = useState<Lenis | null>(sharedLenis);

  useEffect(() => {
    listeners.add(setInstance);
    return () => {
      listeners.delete(setInstance);
    };
  }, []);

  return instance;
}
