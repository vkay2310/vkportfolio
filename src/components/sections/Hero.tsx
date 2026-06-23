import { FadeInUp } from '../animations/FadeInUp';
import { TextReveal } from '../animations/TextReveal';
import { Button } from '../ui/Button';
import data from '../../data/data.json';

interface Props {
  onPlay: () => void;
}

export function Hero({ onPlay }: Props) {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-32 pb-16 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="z-10 flex flex-col items-start gap-8">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-medium tracking-tighter leading-[0.9]">
            <TextReveal>Vo</TextReveal>
            <br />
            <TextReveal delay={0.1}>Khoi<span className="text-accent">.</span></TextReveal>
          </h1>
          
          <FadeInUp delay={0.3} className="max-w-md">
            <h2 className="text-2xl md:text-3xl font-sans tracking-tight mb-4">
              {data.siteConfig.subtitle}
            </h2>
            <p className="text-muted-foreground font-mono text-sm leading-relaxed">
              {data.siteConfig.description}
            </p>
          </FadeInUp>
          
          <FadeInUp delay={0.5} className="flex flex-wrap items-center gap-4">
            <Button variant="primary" onClick={onPlay}>Watch Showreel</Button>
            <Button variant="ghost" onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}>
              View Work ↓
            </Button>
          </FadeInUp>
        </div>

        {/* Visual Content (Cover Image replacing autoplay video) */}
        <FadeInUp delay={0.2} className="relative aspect-[4/5] md:aspect-square w-full group overflow-hidden bg-card">
          <img 
            src={data.hero.coverImage} 
            alt="Hero Cover Cinematic" 
            className="w-full h-full object-cover transition-transform duration-[20s] ease-linear group-hover:scale-110 opacity-80"
          />
          {/* Decorative Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={onPlay}>
            <div className="w-24 h-24 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform duration-500 bg-background/20">
               <div className="w-0 h-0 border-y-[12px] border-y-transparent border-l-[20px] border-l-white ml-2"></div>
            </div>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
