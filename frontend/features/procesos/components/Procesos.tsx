'use client';

import { Container } from '@/shared/components/ui/Container';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { ProcesoFila } from './ProcesoFila';

export function Procesos() {
  const { t, locale } = useTranslation();

  return (
    <section id="procesos" className="py-20 lg:py-32">
      <Container>
        <h2 className="text-tinta text-[length:var(--paso-3)] lg:text-[length:var(--paso-4)]">
          {t.procesos.title}
        </h2>

        <p className="medida text-tinta-media mt-4">{t.procesos.subtitle}</p>

        <div className="mt-12">
          {t.procesos.items.map((item) => (
            <ProcesoFila
              key={item.numero}
              numero={item.numero}
              titulo={item.titulo}
              hoy={item.hoy}
              resuelve={item.resuelve}
              ctaLabel={t.procesos.ctaItem}
              locale={locale}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
