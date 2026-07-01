import { useEffect, useRef, useState } from 'react';

/**
 * Custom cursor: a small dot tracks the pointer exactly, a larger ring
 * eases behind it, and the ring grows when hovering anything clickable.
 * Desktop-only — bows out entirely on touch devices where there's no
 * real cursor to replace.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || prefersReducedMotion) return;
    setEnabled(true);
    document.body.classList.add('custom-cursor-active');

    let rx = 0, ry = 0; // ring position (lagging)
    let tx = 0, ty = 0; // pointer target position
    let raf: number;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      setHidden(false);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${tx}px, ${ty}px)`;
      }

      const target = e.target as HTMLElement | null;
      setHovering(Boolean(target?.closest('a, button, [role="button"], input, textarea, [data-cursor-hover]')));
    };

    const onLeaveWindow = () => setHidden(true);

    const tick = () => {
      rx = lerp(rx, tx, 0.18);
      ry = lerp(ry, ty, 0.18);
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeaveWindow);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeaveWindow);
      document.body.classList.remove('custom-cursor-active');
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      className="fixed inset-0 z-[200] pointer-events-none"
      style={{ opacity: hidden ? 0 : 1, transition: 'opacity 0.3s ease' }}
      aria-hidden="true"
    >
      <div
        ref={dotRef}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
        style={{ width: 6, height: 6, willChange: 'transform' }}
      />
      <div
        ref={ringRef}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-[width,height,opacity] duration-300 ease-out"
        style={{
          width: hovering ? 56 : 32,
          height: hovering ? 56 : 32,
          borderColor: hovering ? 'rgba(255,61,0,0.7)' : 'rgba(255,255,255,0.35)',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
