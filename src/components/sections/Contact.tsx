import { FadeInUp } from '../animations/FadeInUp';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import data from '../../data/data.json';

export function Contact() {
  return (
    <section id="contact" className="py-32 bg-foreground text-background">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading title="Contact" subtitle="Let's Create Something Together" light />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-12 md:mt-24 items-end">
          <FadeInUp className="max-w-md">
            <p className="font-mono text-base md:text-lg text-background/80 leading-relaxed">
              Have a project in mind? Let's talk about your vision. Give me a message on your preferred platform.
            </p>
          </FadeInUp>
          
          <FadeInUp delay={0.2} className="flex flex-col gap-4">
             <a href={data.siteConfig.social.instagram} target="_blank" rel="noreferrer">
               <Button variant="outline" size="lg" className="w-full border-background text-background hover:bg-background hover:text-foreground shadow-none rounded-none py-6">Instagram →</Button>
             </a>
             <a href={data.siteConfig.social.facebook} target="_blank" rel="noreferrer">
               <Button variant="outline" size="lg" className="w-full border-background text-background hover:bg-background hover:text-foreground shadow-none rounded-none py-6">Facebook →</Button>
             </a>
             <a href={data.siteConfig.social.zalo} target="_blank" rel="noreferrer">
               <Button variant="outline" size="lg" className="w-full border-background text-background hover:bg-background hover:text-foreground shadow-none rounded-none py-6">Zalo →</Button>
             </a>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
}
