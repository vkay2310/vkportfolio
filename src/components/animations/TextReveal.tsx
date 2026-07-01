import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { EASE_CINEMATIC } from '../../lib/motion';

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
  /**
   * 'viewport' (default) — reveals when scrolled into view, for content
   * further down the page.
   * 'immediate' — reveals right on mount via `animate`, for content that's
   * already visible on load (e.g. the Hero name) where `whileInView` can't
   * be relied on to fire consistently as part of an orchestrated sequence.
   */
  mode?: 'viewport' | 'immediate';
}

export function TextReveal({ children, delay = 0, className = "", mode = 'viewport' }: Props) {
  const transition = { duration: 0.7, delay, ease: EASE_CINEMATIC };

  return (
    <span className={cn("overflow-hidden inline-block align-bottom", className)}>
      {mode === 'immediate' ? (
        <motion.span
          className="inline-block"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={transition}
        >
          {children}
        </motion.span>
      ) : (
        <motion.span
          className="inline-block"
          initial={{ y: "100%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={transition}
        >
          {children}
        </motion.span>
      )}
    </span>
  );
}
