'use client';

import { m } from 'motion/react';
import { Container } from '@/shared/components/ui/Container';
import { SectionHeading } from '@/shared/components/ui/SectionHeading';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { usePhaseProgress } from '../hooks/usePhaseProgress';
import { Phase } from './Phase';
import { TechnologyTicker } from './TechnologyTicker';

export function HowWeWork() {
  const { t } = useTranslation();
  const { ref, reachedCount, style } = usePhaseProgress(t.howWeWork.phases.length);

  return (
    <section id="proceso" className="dark-band section">
      <Container>
        <SectionHeading
          number="03"
          eyebrow={t.howWeWork.eyebrow}
          title={t.howWeWork.title}
          intro={t.howWeWork.subtitle}
          introClassName="text-[var(--hueso-tenue)]"
        />

        <m.div ref={ref} style={style} className="relative mt-16 pl-6 md:mt-20 md:pl-0 md:pt-8">
          <div
            aria-hidden="true"
            className="absolute left-0 top-0 h-full w-px bg-[var(--pista-noche)] md:h-px md:w-full"
          >
            <div className="phase-progress absolute inset-0 bg-hueso" />
          </div>

          <ol className="grid grid-cols-1 gap-14 md:grid-cols-3 md:gap-10">
            {t.howWeWork.phases.map((phase, index) => (
              <Phase
                key={phase.number}
                reached={index < reachedCount}
                phaseLabel={t.howWeWork.phaseLabel}
                number={phase.number}
                title={phase.title}
                description={phase.description}
                deliverable={phase.deliverable}
                deliverableLabel={t.howWeWork.deliverableLabel}
              />
            ))}
          </ol>
        </m.div>

        <div className="mt-20 border-t border-[var(--regla-noche)] pt-10 md:mt-24">
          <TechnologyTicker
            label={t.howWeWork.stackLabel}
            pause={t.howWeWork.pause}
            resume={t.howWeWork.resume}
          />
        </div>
      </Container>
    </section>
  );
}
