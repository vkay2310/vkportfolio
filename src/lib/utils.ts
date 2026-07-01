import type React from 'react';

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

// Combines multiple refs (forwarded + internal) into one callback ref,
// so a component can use its own ref internally while still supporting
// a ref passed in by its parent via forwardRef.
export function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (value: T | null) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(value);
      } else {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}
