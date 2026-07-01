import { motion } from 'framer-motion';
import data from '../../data/data.json';

export function Footer() {
  const links = [
    { label: 'Instagram', href: data.siteConfig.social.instagram },
    { label: 'Facebook', href: data.siteConfig.social.facebook },
    { label: 'Zalo', href: data.siteConfig.social.zalo },
  ];

  return (
    <footer
      className="relative pt-20 pb-10 border-t overflow-hidden"
      style={{
        background: 'var(--color-space-deep)',
        borderColor: 'rgba(255,255,255,0.04)',
      }}
    >
      {/* Depth atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(40,60,140,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10"
        >
          <div>
            <h3
              className="text-3xl tracking-[0.15em] font-bold uppercase mb-3 text-foreground"
              style={{ textShadow: '0 0 30px rgba(255,61,0,0.2)' }}
            >
              Vo Khoi<span className="text-accent ambient-pulse">.</span>
            </h3>
            <p className="text-muted-foreground font-mono text-sm max-w-xs leading-relaxed">
              Visual Storyteller & Cinematic Video Editor based in Vietnam.
            </p>
          </div>

          <div className="flex flex-col md:items-end gap-3 text-sm font-mono tracking-widest uppercase">
            {links.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="relative group text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-accent group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>
        </motion.div>

        <div
          className="mt-16 pt-6 border-t text-xs font-mono text-muted-foreground/50 flex flex-col md:flex-row justify-between uppercase tracking-widest gap-4"
          style={{ borderColor: 'rgba(255,255,255,0.04)' }}
        >
          <span>© {new Date().getFullYear()} Vo Khoi. All rights reserved.</span>
          <span>Apple × Cinematic × Space</span>
        </div>
      </div>
    </footer>
  );
}