import { Card } from '@/shared/components/ui/Card';
import { IconWrapper } from '@/shared/components/ui/IconWrapper';
import { Badge } from '@/shared/components/ui/Badge';
import { Project } from '@/shared/types';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { icon, title, description, tags } = project;

  return (
    <Card className="h-full flex flex-col space-y-6 group hover:scale-[1.02] transition-transform duration-300">
      {/* Icon */}
      <IconWrapper icon={icon} variant="gradient" size="xl" />

      {/* Title and Description */}
      <div className="space-y-3 flex-1">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="default">
            {tag}
          </Badge>
        ))}
      </div>
    </Card>
  );
}
