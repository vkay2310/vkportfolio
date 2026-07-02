import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { TextReveal } from '../animations/TextReveal';
import { Button } from '../ui/Button';
import data from '../../data/data.json';

interface Props {
  onPlay: () => void;
}

export function Hero({ onPlay }: Props) {
  const heroRef = useRef<HTMLElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animFrame: number;
    let lx = 50, ly = 50;
    let tx = 50, ty = 50;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const onMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      tx = ((e.clientX - rect.left) / rect.width) * 100;
      ty = ((e.clientY - rect.top) / rect.height) * 100;
    };

    const LIGHT_HALF = 300; // half of the 600px glow below — keep in sync

    const tick = () => {
      lx = lerp(lx, tx, 0.06);
      ly = lerp(ly, ty, 0.06);

      // Hero image subtle parallax — depth without shake
      if (imageRef.current) {
        const dx = (lx - 50) * 0.015;
        const dy = (ly - 50) * 0.015;
        imageRef.current.style.transform = `translate(${dx}%, ${dy}%) scale(1.04)`;
      }
      // Light follows the cursor via transform (compositor-only) instead of
      // rewriting a radial-gradient's center every frame — same technique
      // as the global env-mouse-light, scoped to this section.
      if (lightRef.current && heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const px = (lx / 100) * rect.width;
        const py = (ly / 100) * rect.height;
        lightRef.current.style.transform = `translate3d(${px - LIGHT_HALF}px, ${py - LIGHT_HALF}px, 0)`;
      }
      animFrame = requestAnimationFrame(tick);
    };

    const el = heroRef.current;
    el?.addEventListener('mousemove', onMove, { passive: true });
    animFrame = requestAnimationFrame(tick);

    return () => {
      el?.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex items-center pt-32 pb-16 overflow-hidden"
    >
      {/* Hero local light — reacts to mouse, clipped to this section */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          ref={lightRef}
          className="absolute top-0 left-0 will-change-transform"
          style={{
            width: 600,
            height: 600,
            background: 'radial-gradient(circle, rgba(255,61,0,0.06) 0%, transparent 70%)',
            transform: 'translate3d(-300px, -300px, 0)',
          }}
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">

        {/* ── Text Content ── */}
        <div className="flex flex-col items-start gap-8">

          {/* Eyebrow label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3"
          >
            <span className="w-8 h-[1px] bg-accent block" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">
              {data.siteConfig.eyebrow ?? data.siteConfig.subtitle}
            </span>
          </motion.div>

          {/* Name — display typography */}
          <h1
            className="text-6xl md:text-8xl lg:text-9xl font-display font-medium tracking-tighter leading-[0.9]"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9), 0 8px 32px rgba(0,0,0,0.5)' }}
          >
            <TextReveal mode="immediate" delay={0.15}>Vo</TextReveal>
            <br />
            <TextReveal mode="immediate" delay={0.25}>
              Khoi<span className="text-accent" style={{ textShadow: '0 0 30px rgba(255,61,0,0.6)' }}>.</span>
            </TextReveal>
          </h1>

          {/* Subtitle + Description */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md"
          >
            <h2 className="text-xl md:text-2xl font-sans tracking-tight mb-3 text-foreground/90">
              {data.siteConfig.subtitle}
            </h2>
            <p className="text-muted-foreground font-mono text-sm leading-relaxed">
              {data.siteConfig.description}
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-4"
          >
            <Button variant="primary" onClick={onPlay}>Watch Showreel</Button>
            <Button
              variant="ghost"
              onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Work ↓
            </Button>
          </motion.div>
        </div>

        {/* ── Visual — Hero Image with depth ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[4/5] md:aspect-square w-full overflow-hidden depth-3 media-frame"
          style={{ background: 'var(--color-space-surface)' }}
        >
          {/* Image — parallax driven by mouse */}
          <div
            ref={imageRef}
            className="absolute inset-[-4%] will-change-transform"
            style={{ transition: 'transform 0.1s linear' }}
          >
            <img
              src={data.hero.coverImage}
              alt="Hero Cover Cinematic"
              fetchPriority="high"
              className="w-full h-full object-cover"
              style={{ opacity: 0.85 }}
            />
          </div>

          {/* Depth gradient — bottom fade into environment */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(4,5,10,0.7) 0%, transparent 50%), linear-gradient(to right, rgba(4,5,10,0.3) 0%, transparent 40%)',
              zIndex: 1,
            }}
          />

          {/* "Most Viral" badge — social-proof hook, echoes the language
              of the platform this footage actually lives on (TikTok) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-5 left-5 z-20 flex items-center gap-1.5 pl-2.5 pr-3.5 py-1.5 rounded-full viral-badge"
          >
            <Flame size={14} className="text-white viral-flame" fill="currentColor" strokeWidth={0} />
            <span className="font-sans text-[11px] font-bold tracking-[0.08em] uppercase text-white">
              Most Viral
            </span>
          </motion.div>

          {/* Play button — elevated above image */}
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
            onClick={onPlay}
          >
            <div className="relative flex items-center justify-center">
              {/* Ambient pulse rings — invite the click without being asked */}
              <motion.span
                className="absolute rounded-full border border-white/25"
                style={{ width: 80, height: 80 }}
                animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
              />
              <motion.span
                className="absolute rounded-full border border-accent/40"
                style={{ width: 80, height: 80 }}
                animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: 1.1 }}
              />
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 rounded-full flex items-center justify-center glass depth-2"
                style={{ border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <div className="w-0 h-0 border-y-[10px] border-y-transparent border-l-[18px] border-l-white ml-1.5" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[1px] h-8 bg-gradient-to-b from-muted-foreground to-transparent"
        />
      </motion.div>
    </section>
  );
}