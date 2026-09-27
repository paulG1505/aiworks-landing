'use client';

import { Container } from '@/shared/components/ui/Container';
import { useTranslation } from '@/shared/hooks/useTranslation';

export function Porque() {
  const { t } = useTranslation();

  return (
    <section id="porque" className="py-20 lg:py-32 bg-[var(--papel)]">
      <Container>
        <div className="mb-12 lg:mb-16">
          <h2 className="text-[length:var(--paso-5)] text-[var(--tinta)]">{t.porque.title}</h2>
        </div>

        <div>
          {t.porque.items.map((item) => (
            <div key={item.titulo} className="fila space-y-3">
              <h3 className="text-[length:var(--paso-2)] text-[var(--tinta)]">{item.titulo}</h3>
              <p className="medida text-[var(--tinta-media)]">{item.descripcion}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
