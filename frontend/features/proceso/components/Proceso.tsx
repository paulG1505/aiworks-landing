'use client';

import { Container } from '@/shared/components/ui/Container';
import { Fase } from './Fase';
import { useTranslation } from '@/shared/hooks/useTranslation';

export function Proceso() {
  const { t } = useTranslation();

  return (
    <section id="proceso" className="py-20 lg:py-32 bg-[var(--papel-hundido)]">
      <Container>
        <div className="mb-12 lg:mb-16 space-y-4">
          <h2 className="text-[length:var(--paso-5)] text-[var(--tinta)]">{t.proceso.title}</h2>
          <p className="medida text-[var(--tinta-media)]">{t.proceso.subtitle}</p>
        </div>

        <div>
          {t.proceso.fases.map((fase) => (
            <Fase
              key={fase.numero}
              numero={fase.numero}
              titulo={fase.titulo}
              descripcion={fase.descripcion}
              entregable={fase.entregable}
              entregableLabel={t.proceso.entregableLabel}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
          <span className="text-[var(--tinta-media)] text-[length:var(--paso--1)]">
            {t.proceso.stackLabel}
          </span>
          <span className="text-[var(--tinta-media)] text-[length:var(--paso--1)]">
            {t.proceso.stack}
          </span>
        </div>
      </Container>
    </section>
  );
}
