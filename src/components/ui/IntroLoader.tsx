import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASE_CINEMATIC } from '../../lib/motion';
import data from '../../data/data.json';

const SESSION_KEY = 'vk_intro_shown';

// Images worth waiting for before the reveal — enough that the site
// doesn't "pop in" half-loaded right after the intro wipes away, not so
// many that a slow connection stalls the intro itself (there's a hard
// timeout below for that).
const PRELOAD_URLS = [data.hero.coverImage, data.about.portraitImage].filter(Boolean) as string[];

function preload(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // don't let a broken image hang the intro
    img.src = url;
  });
}

interface Props {
  onDone?: () => void;
}

export function IntroLoader({ onDone }: Props) {
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Skip entirely — for reduced-motion users and for repeat visits within
  // the same tab session (nobody wants to re-watch an intro every time
  // they hit refresh or come back from /admin).
  const alreadyShown = typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY) === '1';
  const [visible, setVisible] = useState(!prefersReducedMotion && !alreadyShown);
  const [progress, setProgress] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!visible) {
      onDone?.();
      return;
    }

    let cancelled = false;
    const start = performance.now();
    const MIN_DURATION = 1100; // feels intentional, not a flash
    const MAX_DURATION = 3200; // never block on a slow network longer than this

    // Progress bar: mostly cosmetic (ties loosely to real preload progress
    // for the first ~80%, then eases to 100% on its own so it never
    // stalls waiting on a slow image).
    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - start;
      const t = Math.min(1, elapsed / MAX_DURATION);
      setProgress(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1 && !cancelled) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    Promise.all(PRELOAD_URLS.map(preload)).then(() => {
      if (cancelled) return;
      const elapsed = performance.now() - start;
      const wait = Math.max(0, MIN_DURATION - elapsed);
      window.setTimeout(finish, wait);
    });

    // Absolute safety net — never let the intro block the site.
    const hardTimeout = window.setTimeout(finish, MAX_DURATION);

    function finish() {
      if (doneRef.current || cancelled) return;
      doneRef.current = true;
      setProgress(100);
      sessionStorage.setItem(SESSION_KEY, '1');
      window.setTimeout(() => setVisible(false), 350);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(hardTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE_CINEMATIC }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
          style={{ background: 'var(--color-background)' }}
          aria-hidden="true"
        >
          {/* Light sweep — reveals through the middle as the intro exits,
              echoing the .shine-sweep material language used on cards. */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.6, ease: EASE_CINEMATIC, delay: 0.3 }}
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,61,0,0.08) 0%, transparent 70%)',
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE_CINEMATIC }}
            className="flex flex-col items-center gap-6"
          >
            <span
              className="font-display text-4xl md:text-5xl tracking-tight text-foreground"
              style={{ textShadow: '0 2px 16px rgba(0,0,0,0.6)' }}
            >
              {data.siteConfig.title.split(' ')[0]}{' '}
              <span className="text-accent" style={{ textShadow: '0 0 24px rgba(255,61,0,0.6)' }}>
                {data.siteConfig.title.split(' ').slice(1).join(' ')}.
              </span>
            </span>

            {/* Progress line */}
            <div className="w-40 h-[1px] bg-border relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-accent"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2, ease: 'linear' }}
              />
            </div>
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground tabular-nums">
              {progress}%
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
