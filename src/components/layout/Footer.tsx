import { FadeInUp } from '../animations/FadeInUp';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background pt-24 pb-12">
      <div className="container mx-auto px-6 md:px-12">
        <FadeInUp className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div>
            <h3 className="text-3xl tracking-[0.15em] font-bold uppercase mb-4">Vo Khoi <span className="text-accent">.</span></h3>
            <p className="text-muted-foreground font-mono text-sm max-w-sm">Visual Storyteller & Cinematic Video Editor based in Vietnam.</p>
          </div>
          
          <div className="flex flex-col md:items-end gap-4 text-sm font-mono tracking-widest uppercase">
            <a href="https://instagram.com/vokhoi" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">Instagram</a>
            <a href="https://facebook.com/vokhoi" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">Facebook</a>
            <a href="https://zalo.me/vokhoi" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">Zalo</a>
          </div>
        </FadeInUp>
        
        <FadeInUp delay={0.2} className="mt-20 pt-8 border-t border-border/50 text-xs font-mono text-muted-foreground/60 flex flex-col md:flex-row justify-between uppercase tracking-widest gap-4">
          <span>© {new Date().getFullYear()} Vo Khoi. All rights reserved.</span>
          <span>Designed with absolute minimal.</span>
        </FadeInUp>
      </div>
    </footer>
  );
}
