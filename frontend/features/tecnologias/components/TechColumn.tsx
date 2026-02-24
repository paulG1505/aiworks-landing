import { Card } from '@/shared/components/ui/Card';
import { TechStack } from '@/shared/types';

interface TechColumnProps {
  tech: TechStack;
}

export function TechColumn({ tech }: TechColumnProps) {
  return (
    <Card padding="md" className="h-full">
      <div className="space-y-4">
        {/* Category Title */}
        <h3 className="text-xl font-bold text-[var(--primary-cyan)] pb-3 border-b border-[var(--white-15)]">
          {tech.category}
        </h3>

        {/* Technologies List */}
        <ul className="space-y-2">
          {tech.technologies.map((technology) => (
            <li
              key={technology}
              className="text-gray-300 text-sm flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-cyan)]" />
              {technology}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
