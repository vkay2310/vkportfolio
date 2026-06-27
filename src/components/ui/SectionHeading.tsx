import { motion } from 'framer-motion';
import { TextReveal } from '../animations/TextReveal';
import { cn } from '../../lib/utils';
import { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: ReactNode;
  light?: boolean;
}

export function SectionHeading({ title, subtitle, light = false }: Props) {
  return (
    <div className="mb-16 md:mb-24 flex flex-col items-start w-full relative z-10">
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-4 mb-6"
      >
        {/* Animated accent line */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 48 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className={cn('h-[2px] shrink-0', light ? 'bg-foreground' : 'bg-accent')}
          style={!light ? { boxShadow: '0 0 8px rgba(255,61,0,0.6)' } : undefined}
        />
        <span className={cn(
          "font-mono uppercase tracking-[0.25em] text-xs font-semibold",
          light ? "text-foreground/60" : "text-muted-foreground"
        )}>
          {title}
        </span>
      </motion.div>

      {subtitle && (
        <h2 className={cn(
          "text-4xl md:text-6xl font-display font-medium tracking-tighter leading-tight max-w-3xl",
          light ? "text-foreground" : "text-foreground"
        )}
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
        >
          <TextReveal>{subtitle}</TextReveal>
        </h2>
      )}
    </div>
  );
}