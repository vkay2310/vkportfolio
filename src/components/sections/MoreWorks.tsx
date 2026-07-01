import { useRef } from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { cn } from '../../lib/utils';
import data from '../../data/data.json';
import { useTikTokThumbnail } from '../../hooks/useTikTokThumbnail';

interface Props {
  onPlay: (url: string) => void;
}

export function MoreWorks({ onPlay }: Props) {
  const moreProjects = data.projects.filter((p) => !p.featured);
  if (moreProjects.length === 0) return null;

  return (
    <section
      className="py-24 relative"
      style={{ background: 'rgba(6,7,12,0.6)', backdropFilter: 'blur(2px)' }}
    >
      {/* Section ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(80,120,255,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <SectionHeading title="More Works" index={2} />

        {/* Bento grid — first card stands taller/wider to break the
            uniform-square rhythm and give the section a focal point. */}
        <div className="grid grid-cols-2 lg:grid-cols-4 grid-flow-dense gap-4">
          {moreProjects.map((project, i) => (
            <MoreWorkCard
              key={project.id}
              project={project}
              index={i}
              large={i === 0}
              onPlay={() => onPlay(project.tiktokUrl)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function MoreWorkCard({
  project,
  index,
  large,
  onPlay,
}: {
  project: (typeof data.projects)[0];
  index: number;
  large?: boolean;
  onPlay: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const hasVideo = Boolean(project.tiktokUrl);
  const thumbnail = useTikTokThumbnail(project.tiktokUrl, project.thumbnailUrl);
  const hasMeta = Boolean(project.duration || project.client);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current.style.setProperty('--card-mouse-x', `${x}%`);
    ref.current.style.setProperty('--card-mouse-y', `${y}%`);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onClick={() => hasVideo && onPlay()}
      role="button"
      tabIndex={hasVideo ? 0 : -1}
      aria-disabled={!hasVideo}
      onKeyDown={(e) => {
        if (hasVideo && (e.key === 'Enter' || e.key === ' ')) onPlay();
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'relative group overflow-hidden spotlight-card depth-2 media-frame shine-sweep',
        large ? 'col-span-2 row-span-2 aspect-square sm:aspect-[4/3] lg:aspect-square' : 'aspect-square',
        hasVideo ? 'cursor-pointer' : 'cursor-default'
      )}
      style={{ background: 'var(--color-space-surface)' }}
    >
      <motion.img
        src={thumbnail}
        alt={project.title}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover"
        style={{ opacity: hasVideo ? 0.75 : 0.45 }}
        whileHover={{ scale: 1.06, opacity: hasVideo ? 0.95 : 0.5 }}
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
      />

      {/* Depth gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(4,5,10,0.85) 0%, rgba(4,5,10,0.2) 50%, transparent 100%)',
        }}
      />

      {/* Info — rises from bottom */}
      <div className="absolute inset-0 flex flex-col justify-end p-5">
        <motion.p
          className="font-mono text-accent text-[10px] tracking-[0.25em] uppercase mb-1.5"
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.08 + 0.3 }}
        >
          {project.category}
        </motion.p>
        <h4
          className={cn('font-display tracking-tight text-white', large ? 'text-2xl md:text-3xl' : 'text-xl')}
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
        >
          {project.title}
        </h4>

        {!hasVideo && (
          <span className="mt-1.5 font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
            Coming Soon
          </span>
        )}

        {/* Extra detail revealed on hover — duration / client, when provided */}
        {hasMeta && (
          <div className="max-h-0 group-hover:max-h-8 overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <p className="mt-1.5 font-mono text-[11px] text-foreground/60 tracking-wide">
              {[project.duration, project.client].filter(Boolean).join(' · ')}
            </p>
          </div>
        )}

        {/* Line appears on hover */}
        <div className="mt-3 h-[1px] bg-gradient-to-r from-accent/50 to-transparent w-0 group-hover:w-full transition-all duration-600" />
      </div>
    </motion.div>
  );
}
