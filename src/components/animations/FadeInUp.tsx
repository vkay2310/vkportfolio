import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { EASE_CINEMATIC, DURATION } from '../../lib/motion';

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
  onClick?: () => void;
}

export function FadeInUp({ children, delay = 0, className = '', once = true, onClick }: Props) {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 32, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '-40px' }}
      transition={{
        duration: DURATION.slow,
        delay,
        ease: EASE_CINEMATIC,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}