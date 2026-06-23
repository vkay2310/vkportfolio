import { SectionHeading } from '../ui/SectionHeading';
import data from '../../data/data.json';

export function MoreWorks() {
  const moreProjects = data.projects.filter(p => !p.featured);

  if (moreProjects.length === 0) return null;

  return (
    <section className="py-24 bg-card/10">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading title="More Works" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {moreProjects.map((project) => (
            <div key={project.id} className="relative group cursor-pointer aspect-square overflow-hidden bg-muted border border-border">
               <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
               <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent flex flex-col justify-end p-6 translate-y-0 md:translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                 <p className="font-mono text-accent text-xs tracking-[0.2em] uppercase mb-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">{project.category}</p>
                 <h4 className="font-display text-2xl tracking-tight text-white">{project.title}</h4>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
