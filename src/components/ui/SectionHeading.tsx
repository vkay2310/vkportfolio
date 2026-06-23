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
      <div className="flex items-center gap-4 mb-6">
        <div className={cn("w-12 h-[2px]", light ? "bg-background" : "bg-accent")} />
        <span className={cn(
          "font-mono uppercase tracking-[0.2em] text-xs md:text-sm font-semibold",
          light ? "text-background" : "text-muted-foreground"
        )}>
          {title}
        </span>
      </div>
      
      {subtitle && (
        <h2 className={cn(
          "text-4xl md:text-6xl font-display font-medium tracking-tighter leading-tight max-w-3xl",
          light ? "text-background" : "text-foreground"
        )}>
           <TextReveal>{subtitle}</TextReveal>
        </h2>
      )}
    </div>
  );
}
