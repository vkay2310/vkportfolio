import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Avatar } from '../ui/Avatar';
import data from '../../data/data.json';

const LINKS = ['Work', 'About', 'Contact'];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIdRef = useRef<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track which section is currently in view so the matching nav link
  // can light up — instead of staying static the whole time you scroll.
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.toLowerCase())).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (sections.length === 0) return;

    // Ratio of each section currently visible, keyed by id.
    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        let bestId: string | null = null;
        let bestRatio = 0;
        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });
        if (bestRatio > 0 && bestId !== activeIdRef.current) {
          activeIdRef.current = bestId;
          setActiveId(bestId);
        }
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.75, 1], rootMargin: '-15% 0px -55% 0px' }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id.toLowerCase());
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-500",
          scrolled
            ? "glass border-b border-white/5 py-4 depth-2"
            : "bg-transparent border-b border-transparent py-7"
        )}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">

          {/* Logo + personal avatar */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 z-50 group"
            aria-label="Scroll to top"
          >
            <Avatar
              src={data.siteConfig.avatarImage}
              name={data.siteConfig.title}
              size={scrolled ? 32 : 38}
              className="transition-[width,height] duration-500"
            />
            <span className="font-sans font-bold tracking-[0.18em] uppercase text-lg text-foreground group-hover:text-accent transition-colors duration-300">
              Vo Khoi<span className="text-accent" style={{ textShadow: '0 0 12px rgba(255,61,0,0.6)' }}>.</span>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            {LINKS.map((link, i) => {
              const isActive = activeId === link.toLowerCase();
              return (
                <motion.button
                  key={link}
                  onClick={() => scrollTo(link)}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    "relative font-mono text-sm tracking-[0.15em] uppercase transition-colors duration-300 group py-1",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 h-[1px] bg-accent transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  />
                </motion.button>
              );
            })}
          </div>

          {/* Mobile toggle — animated hamburger / close */}
          <button
            className="md:hidden z-50 relative w-8 h-8 flex items-center justify-center text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <motion.span
              className="absolute w-5 h-[1.5px] bg-foreground"
              animate={menuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -5 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.span
              className="absolute w-5 h-[1.5px] bg-foreground"
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="absolute w-5 h-[1.5px] bg-foreground"
              animate={menuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 5 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8"
            style={{ background: 'rgba(4,5,10,0.92)' }}
          >
            {LINKS.map((link, i) => (
              <motion.button
                key={link}
                onClick={() => scrollTo(link)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "text-5xl font-display tracking-tight transition-colors duration-300",
                  activeId === link.toLowerCase() ? "text-accent" : "text-foreground hover:text-accent"
                )}
              >
                {link}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
