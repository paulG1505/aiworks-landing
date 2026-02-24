'use client';

import { ShieldCheck, ShoppingBag, Route, Activity } from 'lucide-react';
import { AnimatedSection } from '@/shared/components/ui/AnimatedSection';
import { ServiceCard } from './ServiceCard';
import { useTranslation } from '@/shared/hooks/useTranslation';

export function ServicesGrid() {
  const { t } = useTranslation();

  const services = [
    {
      icon: ShieldCheck,
      title: t.services.cards.fintech.title,
      problem: t.services.cards.fintech.problem,
      solution: t.services.cards.fintech.solution,
      benefit: t.services.cards.fintech.benefit,
    },
    {
      icon: ShoppingBag,
      title: t.services.cards.retail.title,
      problem: t.services.cards.retail.problem,
      solution: t.services.cards.retail.solution,
      benefit: t.services.cards.retail.benefit,
    },
    {
      icon: Route,
      title: t.services.cards.logistics.title,
      problem: t.services.cards.logistics.problem,
      solution: t.services.cards.logistics.solution,
      benefit: t.services.cards.logistics.benefit,
    },
    {
      icon: Activity,
      title: t.services.cards.healthcare.title,
      problem: t.services.cards.healthcare.problem,
      solution: t.services.cards.healthcare.solution,
      benefit: t.services.cards.healthcare.benefit,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
      {services.map((service, index) => (
        <AnimatedSection
          key={service.title}
          animation="fade-up"
          delay={index * 100}
        >
          <ServiceCard service={service} />
        </AnimatedSection>
      ))}
    </div>
  );
}
