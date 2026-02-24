'use client';

import { AnimatedSection } from '@/shared/components/ui/AnimatedSection';
import { ProcessStep } from './ProcessStep';
import { useTranslation } from '@/shared/hooks/useTranslation';

export function ProcessTimeline() {
  const { t } = useTranslation();

  const processSteps = [
    {
      number: 1,
      title: t.process.steps.discovery.title,
      description: t.process.steps.discovery.description,
    },
    {
      number: 2,
      title: t.process.steps.design.title,
      description: t.process.steps.design.description,
    },
    {
      number: 3,
      title: t.process.steps.development.title,
      description: t.process.steps.development.description,
    },
    {
      number: 4,
      title: t.process.steps.testing.title,
      description: t.process.steps.testing.description,
    },
    {
      number: 5,
      title: t.process.steps.deployment.title,
      description: t.process.steps.deployment.description,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-8">
        {processSteps.map((step, index) => (
          <AnimatedSection
            key={step.number}
            animation="slide-right"
            delay={index * 150}
          >
            <ProcessStep
              step={step}
              isLast={index === processSteps.length - 1}
            />
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
