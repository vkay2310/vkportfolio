import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { EASE_CINEMATIC } from '../../lib/motion';

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function TextReveal({ children, delay = 0, className = "" }: Props) {
  return (
    <span className={cn("overflow-hidden inline-block align-bottom", className)}>
      <motion.span
        className="inline-block"
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, delay, ease: EASE_CINEMATIC }}
      >
        {children}
      </motion.span>
    </span>
  );
}
