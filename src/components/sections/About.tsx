import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import data from '../../data/data.json';

export function About() {
  // `bio` can be a single string (current content) or an array of
  // paragraphs (once it's split up later) — both render the same way.
  const bioParagraphs = Array.isArray(data.about.bio) ? data.about.bio : [data.about.bio];

  const portraitWrapRef = useRef<HTMLDivElement>(null);
  // Scroll-driven parallax — the photo drifts at a different speed than
  // the page scroll as this section passes through view, giving the same
  // sense of depth Hero gets from mouse-driven parallax, adapted for a
  // section the visitor scrolls past rather than lands on.
  const { scrollYProgress } = useScroll({
    target: portraitWrapRef,
    offset: ['start end', 'end start'],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

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
        <SectionHeading title="About" index={3} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Portrait — hero-scale, the dominant visual of this section */}
          <motion.div
            ref={portraitWrapRef}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative w-full aspect-[4/5] md:aspect-[3/4] overflow-hidden depth-3 light-wrap"
            style={{ background: 'var(--color-space-surface)' }}
          >
            <motion.img
              src={data.about.portraitImage}
              alt="Vo Khoi Portrait"
              loading="lazy"
              decoding="async"
              className="absolute inset-[-12%] w-[124%] h-[124%] object-cover"
              style={{ opacity: 0.88, filter: 'grayscale(15%)', y: portraitY }}
            />
            {/* Portrait depth gradient */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(4,5,10,0.35) 0%, transparent 45%, rgba(4,5,10,0.45) 100%), linear-gradient(to top, rgba(4,5,10,0.55) 0%, transparent 35%)',
              }}
            />

            {/* Caption ribbon — echoes the eyebrow treatment used in Hero */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-6 left-6 flex items-center gap-3"
            >
              <span className="w-6 h-[1px] bg-accent block" />
              <span className="font-mono text-xs tracking-[0.25em] uppercase text-white/85">
                {data.siteConfig.title} — Based in Vietnam
              </span>
            </motion.div>
          </motion.div>

          {/* Text */}
          <div className="lg:col-span-5 flex flex-col gap-12 pt-4 lg:pt-8">
            <div className="flex flex-col gap-5">
              {bioParagraphs.map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className={
                    i === 0
                      ? 'text-3xl md:text-4xl font-display leading-[1.15] tracking-tight'
                      : 'text-base md:text-lg font-sans leading-relaxed text-foreground/75 max-w-xl'
                  }
                  style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
                >
                  {para}
                </motion.p>
              ))}
            </div>

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
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-mono">
                {data.about.tools.map((tool, i) => (
                  <motion.li
                    key={tool.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-start gap-4 group"
                  >
                    <span
                      className="w-5 h-[1px] bg-accent/40 group-hover:w-8 group-hover:bg-accent transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] inline-block shrink-0 mt-2"
                    />
                    <span className="flex flex-col">
                      <span className="text-sm tracking-widest uppercase text-foreground/70 group-hover:text-foreground transition-colors duration-300">
                        {tool.name}
                      </span>
                      {tool.role && (
                        <span className="text-[11px] tracking-wide text-muted-foreground normal-case mt-0.5">
                          {tool.role}
                        </span>
                      )}
                    </span>
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