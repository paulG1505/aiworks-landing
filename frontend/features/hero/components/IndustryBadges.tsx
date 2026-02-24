'use client';

import { CreditCard, Store, Truck, HeartPulse } from 'lucide-react';
import { Badge } from '@/shared/components/ui/Badge';
import { useTranslation } from '@/shared/hooks/useTranslation';

export function IndustryBadges() {
  const { t } = useTranslation();

  const industries = [
    { icon: CreditCard, name: t.hero.industries.fintech },
    { icon: Store, name: t.hero.industries.retail },
    { icon: Truck, name: t.hero.industries.logistics },
    { icon: HeartPulse, name: t.hero.industries.healthcare },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 max-w-3xl">
      {industries.map((industry) => (
        <Badge
          key={industry.name}
          icon={industry.icon}
          variant="gradient"
        >
          {industry.name}
        </Badge>
      ))}
    </div>
  );
}
