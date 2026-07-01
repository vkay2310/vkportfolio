import { useRef } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';

/**
 * Magnetic hover effect: while the pointer is over the element, it eases
 * toward the cursor (capped by `strength`). Also owns the press-state scale
 * so this hook is the single source of truth for the element's `transform`
 * — composing translate + scale into one string avoids fighting any other
 * system (e.g. framer-motion's whileTap) that might also want that property.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T>(null);
  const offset = useRef({ x: 0, y: 0 });
  const pressed = useRef(false);

  const apply = () => {
    const el = ref.current;
    if (!el) return;
    const scale = pressed.current ? 0.96 : 1;
    el.style.transform = `translate(${offset.current.x}px, ${offset.current.y}px) scale(${scale})`;
  };

  const onMouseMove = (e: ReactMouseEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    offset.current = {
      x: (e.clientX - (rect.left + rect.width / 2)) * strength,
      y: (e.clientY - (rect.top + rect.height / 2)) * strength,
    };
    apply();
  };

  const onMouseLeave = () => {
    offset.current = { x: 0, y: 0 };
    pressed.current = false;
    apply();
  };

  const onMouseDown = () => {
    pressed.current = true;
    apply();
  };

  const onMouseUp = () => {
    pressed.current = false;
    apply();
  };

  return { ref, onMouseMove, onMouseLeave, onMouseDown, onMouseUp };
}
