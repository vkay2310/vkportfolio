import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { sectionEnter } from '../../lib/motion';

interface Props {
  children: ReactNode;
  className?: string;
}

/**
 * Bọc quanh mỗi <section> để section "settle" vào khung nhìn với cùng
 * ngôn ngữ cinematic (fade + nâng + blur tan) — khác FadeInUp (cho item nhỏ),
 * cái này dùng cho cả khối section to.
 */
export function SectionTransition({ children, className = '' }: Props) {
  return (
    <motion.div
      initial={sectionEnter.initial}
      whileInView={sectionEnter.animate}
      viewport={{ once: true, margin: '-100px' }}
      transition={sectionEnter.transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
