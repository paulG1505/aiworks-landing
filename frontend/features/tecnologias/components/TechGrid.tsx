'use client';

import { AnimatedSection } from '@/shared/components/ui/AnimatedSection';
import { TechColumn } from './TechColumn';
import { useTranslation } from '@/shared/hooks/useTranslation';

export function TechGrid() {
  const { t } = useTranslation();

  const techStack = [
    {
      category: t.technologies.backend.title,
      technologies: t.technologies.backend.items.map(item => item.startsWith('•') ? item : `• ${item}`),
    },
    {
      category: t.technologies.frontend.title,
      technologies: t.technologies.frontend.items.map(item => item.startsWith('•') ? item : `• ${item}`),
    },
    {
      category: t.technologies.aiml.title,
      technologies: t.technologies.aiml.items.map(item => item.startsWith('•') ? item : `• ${item}`),
    },
    {
      category: t.technologies.infrastructure.title,
      technologies: t.technologies.infrastructure.items.map(item => item.startsWith('•') ? item : `• ${item}`),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {techStack.map((tech, index) => (
        <AnimatedSection
          key={tech.category}
          animation="fade-up"
          delay={index * 100}
        >
          <TechColumn tech={tech} />
        </AnimatedSection>
      ))}
    </div>
  );
}
