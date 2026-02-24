import { Card } from '@/shared/components/ui/Card';
import { IconWrapper } from '@/shared/components/ui/IconWrapper';
import { Badge } from '@/shared/components/ui/Badge';
import { Service } from '@/shared/types';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { icon, title, problem, solution, benefit } = service;

  return (
    <Card className="h-full flex flex-col space-y-4">
      {/* Icon and Title */}
      <div className="flex items-start gap-4">
        <IconWrapper icon={icon} variant="gradient" size="lg" />
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-400 text-sm">{problem}</p>
        </div>
      </div>

      {/* Solution */}
      <p className="text-white leading-relaxed flex-1">
        {solution}
      </p>

      {/* Benefit Badge */}
      <div>
        <Badge variant="cyan" className="text-sm">
          {benefit}
        </Badge>
      </div>
    </Card>
  );
}
