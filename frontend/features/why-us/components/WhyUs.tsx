'use client';

import { Zap, Shield, Code, Users } from 'lucide-react';
import { Container } from '@/shared/components/ui/Container';
import { SectionHeader } from '@/shared/components/ui/SectionHeader';
import { AnimatedSection } from '@/shared/components/ui/AnimatedSection';
import { BenefitCard } from './BenefitCard';
import { useTranslation } from '@/shared/hooks/useTranslation';

export function WhyUs() {
  const { t } = useTranslation();

  const benefits = [
    {
      icon: Zap,
      title: t.whyUs.cards.fast.title,
      description: t.whyUs.cards.fast.description,
    },
    {
      icon: Shield,
      title: t.whyUs.cards.security.title,
      description: t.whyUs.cards.security.description,
    },
    {
      icon: Code,
      title: t.whyUs.cards.quality.title,
      description: t.whyUs.cards.quality.description,
    },
    {
      icon: Users,
      title: t.whyUs.cards.team.title,
      description: t.whyUs.cards.team.description,
    },
  ];

  return (
    <section id="why-us" className="py-20 lg:py-32 bg-[var(--white-5)]">
      <Container>
        <SectionHeader
          title={t.whyUs.title}
          description={t.whyUs.subtitle}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <AnimatedSection
              key={benefit.title}
              animation="scale"
              delay={index * 100}
            >
              <BenefitCard benefit={benefit} />
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}
