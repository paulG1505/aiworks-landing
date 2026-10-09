'use client';

import { Container } from '@/shared/components/ui/Container';
import { SectionHeading } from '@/shared/components/ui/SectionHeading';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useReveal } from '@/shared/hooks/useReveal';
import { ExamplesCarousel } from './ExamplesCarousel';

type Delay = React.CSSProperties & { '--d': string };

// No invented big-number cards: there is no real data to show.
export function WhyUs() {
  const { t } = useTranslation();
  const principles = useReveal<HTMLUListElement>();
  const examples = useReveal();

  return (
    <section id="porque" className="seccion">
      <Container>
        <SectionHeading number="04" eyebrow={t.porque.eyebrow} title={t.porque.titulo} />

        <ul {...principles} className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-10 md:gap-y-14 lg:mt-[72px]">
          {t.porque.items.map((item, index) => (
            <li
              key={item.titulo}
              className="revelar flex flex-col gap-3 border-t border-tinta pt-5"
              style={{ '--d': `${index * 90}ms` } as Delay}
            >
              <h3 className="text-[1.375rem] leading-[1.2] lg:text-[1.625rem]">{item.titulo}</h3>
              <p className="text-tinta-media">{item.descripcion}</p>
            </li>
          ))}
        </ul>

        <div {...examples} id="ejemplos" className="mt-24 scroll-mt-24 lg:mt-32">
          <ExamplesCarousel
            title={t.porque.casos.titulo}
            previous={t.porque.casos.anterior}
            next={t.porque.casos.siguiente}
            todayLabel={t.porque.casos.hoyLabel}
            withAiLabel={t.porque.casos.conIaLabel}
            items={t.porque.casos.items}
          />
        </div>
      </Container>
    </section>
  );
}
