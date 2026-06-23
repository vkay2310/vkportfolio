import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = ['Work', 'About', 'Contact'];

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id.toLowerCase());
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b",
        scrolled ? "bg-background/90 backdrop-blur-md border-border/50 py-4" : "bg-transparent border-transparent py-8"
      )}>
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            className="text-xl md:text-2xl font-bold tracking-[0.15em] uppercase cursor-pointer z-50 mix-blend-difference text-white"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Vo Khoi <span className="text-accent"></span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10 opacity-90">
            {links.map((link) => (
              <Button key={link} variant="ghost" onClick={() => scrollTo(link)}>
                {link}
              </Button>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden block z-50 font-mono tracking-widest text-sm relative text-foreground mix-blend-difference"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? 'CLOSE' : 'MENU'}
          </button>

        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={cn(
        "fixed inset-0 bg-background z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-500 ease-[cubic-bezier(0.25,0,0,1)]",
        menuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {links.map((link, i) => (
          <button 
            key={link} 
            onClick={() => scrollTo(link)}
            className="text-5xl font-display tracking-tight text-foreground hover:text-accent transition-colors"
            style={{ transitionDelay: menuOpen ? `${i * 100 + 300}ms` : '0ms' }}
          >
            {link}
          </button>
        ))}
      </div>
    </>
  );
}
