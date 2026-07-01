import { useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    category: string;
    description: string;
    thumbnailUrl: string;
    tiktokUrl: string;
  };
  index: number;
  featured?: boolean;
  onPlay?: () => void;
}

export function ProjectCard({ project, index, featured = false, onPlay }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const numberStr = (index + 1).toString().padStart(2, '0');
  const hasVideo = Boolean(project.tiktokUrl);
  // Alternate image/text sides on every other featured card so the
  // section reads with rhythm instead of a single repeated layout.
  const reversed = featured && index % 2 === 1;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty('--card-mouse-x', `${x}%`);
    cardRef.current.style.setProperty('--card-mouse-y', `${y}%`);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onClick={() => hasVideo && onPlay?.()}
      role="button"
      tabIndex={hasVideo ? 0 : -1}
      aria-disabled={!hasVideo}
      onKeyDown={(e) => {
        if (hasVideo && (e.key === 'Enter' || e.key === ' ')) onPlay?.();
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'group relative border-t border-border/60 py-8 md:py-12',
        'flex flex-col md:flex-row gap-8 items-start',
        reversed && 'md:flex-row-reverse',
        'spotlight-card',
        'transition-colors duration-300',
        'hover:border-border',
        hasVideo ? 'cursor-pointer' : 'cursor-default'
      )}
    >
      {/* Featured visual */}
      <div className={cn(
        'relative overflow-hidden w-full depth-2 light-wrap',
        featured ? 'md:w-3/5 aspect-video' : 'md:w-1/2 aspect-[4/3]',
      )}>
        {/* Image with parallax scale */}
        <motion.img
          src={project.thumbnailUrl}
          alt={project.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
          style={{ opacity: hasVideo ? 0.85 : 0.55 }}
          whileHover={hasVideo ? { scale: 1.04 } : undefined}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
        />

        {/* Depth overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(4,5,10,0.6) 0%, transparent 60%)',
          }}
        />

        {/* Watch CTA — appears from depth on hover only */}
        {hasVideo ? (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-400">
            <div
              className="flex items-center gap-3 glass px-6 py-3 depth-2 scale-90 group-hover:scale-100 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[9px] border-l-white" />
              <span className="font-mono text-xs tracking-[0.25em] uppercase text-white">
                Watch Project
              </span>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
            <div className="flex items-center gap-3 glass-light px-6 py-3">
              <span className="font-mono text-xs tracking-[0.25em] uppercase text-muted-foreground">
                Coming Soon
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className={cn(
        'flex flex-col justify-center h-full relative z-10',
        featured ? 'md:w-2/5 pt-4' : 'md:w-1/2'
      )}>
        <div className="font-mono text-accent text-sm tracking-widest mb-6 flex items-center gap-3">
          <span>{numberStr}</span>
          <span className="w-4 h-[1px] bg-accent/50 block" />
          <span>{project.category}</span>
        </div>

        <h3
          className="text-4xl md:text-5xl font-display tracking-tight mb-6 transition-colors duration-400 group-hover:text-foreground"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
        >
          {project.title}
        </h3>

        {featured && (
          <p className="text-muted-foreground font-mono text-sm leading-relaxed max-w-sm">
            {project.description}
          </p>
        )}

        {/* Animated line — grows on hover */}
        <div
          className="mt-8 h-[1px] bg-gradient-to-r from-accent/60 to-transparent w-0 group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        />
      </div>
    </motion.div>
  );
}
