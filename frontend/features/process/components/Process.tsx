'use client';

import { m } from 'motion/react';
import { Container } from '@/shared/components/ui/Container';
import { SectionHeading } from '@/shared/components/ui/SectionHeading';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { usePhaseProgress } from '../hooks/usePhaseProgress';
import { Phase } from './Phase';
import { TechTicker } from './TechTicker';

export function Process() {
  const { t } = useTranslation();
  const { ref, reachedCount, style } = usePhaseProgress(t.proceso.fases.length);

  return (
    <section id="proceso" className="oscuro seccion">
      <Container>
        <SectionHeading
          number="03"
          eyebrow={t.proceso.eyebrow}
          title={t.proceso.titulo}
          intro={t.proceso.subtitle}
          introClassName="text-[var(--hueso-tenue)]"
        />

        <m.div ref={ref} style={style} className="relative mt-16 pl-6 md:mt-20 md:pl-0 md:pt-8">
          <div
            aria-hidden="true"
            className="absolute left-0 top-0 h-full w-px bg-[var(--pista-noche)] md:h-px md:w-full"
          >
            <div className="fases-progreso absolute inset-0 bg-hueso" />
          </div>

          <ol className="grid grid-cols-1 gap-14 md:grid-cols-3 md:gap-10">
            {t.proceso.fases.map((phase, index) => (
              <Phase
                key={phase.numero}
                reached={index < reachedCount}
                phaseLabel={t.proceso.faseLabel}
                number={phase.numero}
                title={phase.titulo}
                description={phase.descripcion}
                deliverable={phase.entregable}
                deliverableLabel={t.proceso.entregableLabel}
              />
            ))}
          </ol>
        </m.div>

        <div className="mt-20 border-t border-[var(--regla-noche)] pt-10 md:mt-24">
          <TechTicker
            label={t.proceso.stackLabel}
            pauseLabel={t.proceso.pausar}
            resumeLabel={t.proceso.reanudar}
          />
        </div>
      </Container>
    </section>
  );
}
