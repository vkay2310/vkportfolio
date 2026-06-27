import { useRef } from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import data from '../../data/data.json';

export function MoreWorks() {
  const moreProjects = data.projects.filter(p => !p.featured);
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
        <SectionHeading title="More Works" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {moreProjects.map((project, i) => (
            <MoreWorkCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MoreWorkCard({ project, index }: { project: typeof data.projects[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="relative group cursor-pointer aspect-square overflow-hidden spotlight-card depth-2 light-wrap"
      style={{ background: 'var(--color-space-surface)' }}
    >
      <motion.img
        src={project.thumbnailUrl}
        alt={project.title}
        className="w-full h-full object-cover"
        style={{ opacity: 0.75 }}
        whileHover={{ scale: 1.06, opacity: 0.95 }}
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
          className="font-display text-xl tracking-tight text-white"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
        >
          {project.title}
        </h4>

        {/* Line appears on hover */}
        <div className="mt-3 h-[1px] bg-gradient-to-r from-accent/50 to-transparent w-0 group-hover:w-full transition-all duration-600" />
      </div>
    </motion.div>
  );
}