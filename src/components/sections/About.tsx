import { SectionHeading } from '../ui/SectionHeading';
import { FadeInUp } from '../animations/FadeInUp';
import data from '../../data/data.json';

export function About() {
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading title="About" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          <FadeInUp className="lg:col-span-5 relative w-full aspect-[4/5] bg-muted overflow-hidden border border-border">
             <img src={data.about.portraitImage} alt="Vo Khoi Portrait" className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-[2s]" />
          </FadeInUp>
          
          <div className="lg:col-span-7 flex flex-col gap-12 pt-8">
            <FadeInUp delay={0.2}>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-display leading-[1.1] tracking-tight">
                {data.about.bio}
              </h3>
            </FadeInUp>
            
            <FadeInUp delay={0.4} className="border-t border-border pt-10 mt-4">
              <h4 className="font-mono uppercase tracking-[0.2em] text-sm text-muted-foreground mb-8">Tools & Arsenal</h4>
              <ul className="grid grid-cols-2 gap-4 font-mono text-sm tracking-widest uppercase">
                {data.about.tools.map(tool => (
                  <li key={tool} className="flex items-center gap-4 text-foreground/80 hover:text-accent transition-colors cursor-default">
                    <span className="w-6 h-[1px] bg-border inline-block" />
                    {tool}
                  </li>
                ))}
              </ul>
            </FadeInUp>
          </div>
        </div>
      </div>
    </section>
  );
}
