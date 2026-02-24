import { Card } from '@/shared/components/ui/Card';
import { IconWrapper } from '@/shared/components/ui/IconWrapper';
import { Benefit } from '@/shared/types';

interface BenefitCardProps {
  benefit: Benefit;
}

export function BenefitCard({ benefit }: BenefitCardProps) {
  const { icon, title, description } = benefit;

  return (
    <Card padding="md" className="flex items-start gap-4 hover:border-[var(--primary-blue)] transition-colors">
      <IconWrapper icon={icon} variant="primary" size="md" />
      <div className="flex-1 space-y-2">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>
    </Card>
  );
}
