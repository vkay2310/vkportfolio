import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import data from '../../data/data.json';

export function About() {
  return (
    <section id="about" className="py-24 md:py-32 relative">
      {/* Local atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 0% 50%, rgba(80,120,255,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <SectionHeading title="About" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">

          {/* Portrait — elevated with depth */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative w-full aspect-[4/5] overflow-hidden depth-3 light-wrap"
            style={{ background: 'var(--color-space-surface)' }}
          >
            <img
              src={data.about.portraitImage}
              alt="Vo Khoi Portrait"
              className="w-full h-full object-cover"
              style={{ opacity: 0.85, filter: 'grayscale(20%)' }}
            />
            {/* Portrait depth gradient */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(4,5,10,0.4) 0%, transparent 50%, rgba(4,5,10,0.3) 100%)',
              }}
            />
          </motion.div>

          {/* Text */}
          <div className="lg:col-span-7 flex flex-col gap-12 pt-4 lg:pt-8">
            <motion.h3
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-4xl lg:text-5xl font-display leading-[1.15] tracking-tight"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
            >
              {data.about.bio}
            </motion.h3>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="border-t border-border/60 pt-10"
            >
              <h4 className="font-mono uppercase tracking-[0.25em] text-xs text-muted-foreground mb-8">
                Tools & Arsenal
              </h4>
              <ul className="grid grid-cols-2 gap-3 font-mono text-sm tracking-widest uppercase">
                {data.about.tools.map((tool, i) => (
                  <motion.li
                    key={tool}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-4 text-foreground/70 hover:text-foreground transition-colors duration-300 cursor-default group"
                  >
                    <span
                      className="w-5 h-[1px] bg-accent/40 group-hover:w-8 group-hover:bg-accent transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] inline-block shrink-0"
                    />
                    {tool}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}