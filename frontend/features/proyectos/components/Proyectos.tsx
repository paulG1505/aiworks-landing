'use client';

import { BrainCircuit, Workflow } from 'lucide-react';
import { Container } from '@/shared/components/ui/Container';
import { SectionHeader } from '@/shared/components/ui/SectionHeader';
import { AnimatedSection } from '@/shared/components/ui/AnimatedSection';
import { ProjectCard } from './ProjectCard';
import { useTranslation } from '@/shared/hooks/useTranslation';

export function Proyectos() {
  const { t } = useTranslation();

  const projects = [
    {
      icon: BrainCircuit,
      title: t.projects.cards.dataAnalysis.title,
      description: t.projects.cards.dataAnalysis.description,
      tags: [
        t.projects.cards.dataAnalysis.solutionsLabel,
        t.projects.cards.dataAnalysis.solutions,
      ],
    },
    {
      icon: Workflow,
      title: t.projects.cards.aiIntegration.title,
      description: t.projects.cards.aiIntegration.description,
      tags: [
        t.projects.cards.aiIntegration.solutionsLabel,
        t.projects.cards.aiIntegration.solutions,
      ],
    },
  ];

  return (
    <section id="proyectos" className="py-20 lg:py-32">
      <Container>
        <SectionHeader
          title={t.projects.title}
          description={t.projects.subtitle}
          useGradient
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <AnimatedSection
              key={project.title}
              animation={index % 2 === 0 ? 'slide-left' : 'slide-right'}
              delay={index * 150}
            >
              <ProjectCard project={project} />
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}
