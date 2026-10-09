'use client';

import { Bot, Cloud, FileText, Workflow } from 'lucide-react';
import { Container } from '@/shared/components/ui/Container';
import { SectionHeading } from '@/shared/components/ui/SectionHeading';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useReveal } from '@/shared/hooks/useReveal';

const ICONS = {
  procesos: Workflow,
  chatbots: Bot,
  documentos: FileText,
  nube: Cloud,
} as const;

type Delay = React.CSSProperties & { '--d': string };

export function Services() {
  const { t } = useTranslation();
  const reveal = useReveal<HTMLUListElement>();

  return (
    <section id="servicios" className="seccion bg-arena [--c-regla:var(--regla-arena)]">
      <Container>
        <SectionHeading
          number="01"
          eyebrow={t.servicios.eyebrow}
          title={t.servicios.titulo}
          intro={t.servicios.subtitle}
        />

        <ul {...reveal} className="mt-14 grid grid-cols-1 gap-x-12 gap-y-14 md:grid-cols-2 lg:mt-[72px]">
          {t.servicios.items.map((item, index) => {
            const Icon = ICONS[item.icono];
            return (
              <li
                key={item.titulo}
                className="revelar flex flex-col gap-4 border-t border-tinta pt-6"
                style={{ '--d': `${index * 90}ms` } as Delay}
              >
                <div className="flex items-center justify-between">
                  <Icon className="size-7 text-marca" strokeWidth={1.5} aria-hidden="true" />
                  <span className="tabular text-[0.8125rem] text-tinta-media">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-[1.5rem] leading-[1.15] lg:text-[1.875rem]">{item.titulo}</h3>
                <p className="text-tinta-media">{item.descripcion}</p>
                <p className="border-l-2 border-marca pl-4 text-[0.9375rem] lg:text-base">
                  <span className="font-medium">{t.servicios.ejemploLabel}: </span>
                  {item.ejemplo}
                </p>
                <ul className="flex flex-wrap gap-2" aria-label={t.proceso.stackLabel}>
                  {item.tecnologias.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-[var(--c-regla)] px-3 py-1 font-mono text-xs text-tinta-media"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
