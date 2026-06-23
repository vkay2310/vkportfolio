import { FadeInUp } from '../animations/FadeInUp';
import { cn } from '../../lib/utils';

export interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    category: string;
    description: string;
    thumbnailUrl: string;
    tiktokUrl: string;
  };
  index: number;
  featured?: boolean;
  onPlay?: () => void;
}

export function ProjectCard({ project, index, featured = false, onPlay }: ProjectCardProps) {
  const numberStr = (index + 1).toString().padStart(2, '0');
  return (
    <FadeInUp 
      className="group relative border-t border-border py-8 md:py-12 flex flex-col md:flex-row gap-8 items-start cursor-pointer transition-colors hover:bg-card/20 px-4 -mx-4 rounded-none"
      onClick={() => onPlay && onPlay()}
    >
      {/* Featured visual */}
      <div className={cn(
        "relative overflow-hidden w-full",
        featured ? "md:w-3/5 aspect-video" : "md:w-1/2 aspect-[4/3]"
      )}>
        <img 
          src={project.thumbnailUrl} 
          alt={project.title} 
           className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
        />
        {/* Dark overlay & CTA on hover */}
        <div className="absolute inset-0 bg-background/30 md:bg-background/0 group-hover:bg-background/60 transition-colors duration-500 flex items-end md:items-center justify-start md:justify-center p-6 md:p-0 pointer-events-none">
           <span className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-mono tracking-widest text-xs md:text-sm uppercase translate-y-0 md:translate-y-4 group-hover:translate-y-0 text-white shadow-sm flex items-center gap-2">
             <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-white flex items-center justify-center bg-black/40 md:bg-transparent"><div className="w-0 h-0 border-y-[3px] border-y-transparent border-l-[5px] md:border-y-[4px] md:border-l-[6px] border-l-white ml-0.5"></div></div>
             Watch Project
           </span>
        </div>
      </div>

      {/* Info */}
      <div className={cn(
        "flex flex-col justify-center h-full",
        featured ? "md:w-2/5 pt-4" : "md:w-1/2"
      )}>
        <div className="font-mono text-accent text-sm tracking-widest mb-6">
          {numberStr} ─ {project.category}
        </div>
        <h3 className="text-4xl md:text-5xl font-display tracking-tight mb-6 group-hover:text-accent transition-colors duration-300">
          {project.title}
        </h3>
        {featured && (
          <p className="text-muted-foreground font-mono text-sm leading-relaxed max-w-sm">
            {project.description}
          </p>
        )}
      </div>
    </FadeInUp>
  );
}
