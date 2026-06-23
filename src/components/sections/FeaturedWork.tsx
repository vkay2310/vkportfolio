import { SectionHeading } from '../ui/SectionHeading';
import { ProjectCard } from '../ui/ProjectCard';
import data from '../../data/data.json';

interface Props {
  onPlay: (url: string) => void;
}

export function FeaturedWork({ onPlay }: Props) {
  const featuredProjects = data.projects.filter(p => p.featured);

  return (
    <section id="work" className="py-24 md:py-32">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading title="Featured Work" subtitle="Selected Projects" />

        <div className="flex flex-col">
          {featuredProjects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} featured onPlay={() => onPlay(project.tiktokUrl)} />
          ))}
        </div>
      </div>
    </section>
  );
}
