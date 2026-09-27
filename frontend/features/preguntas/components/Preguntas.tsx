'use client';

import { Container } from '@/shared/components/ui/Container';
import { EncabezadoSeccion } from '@/shared/components/ui/EncabezadoSeccion';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Pregunta } from './Pregunta';

/**
 * Fondo arena: separa del bloque claro anterior sin gastar un segundo oscuro. Desde lg,
 * titular fijo a la izquierda y preguntas a la derecha.
 */
export function Preguntas() {
  const { t } = useTranslation();

  return (
    <section id="preguntas" className="seccion bg-arena [--c-regla:var(--regla-arena)]">
      <Container className="lg:grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <EncabezadoSeccion
          numero="04"
          eyebrow={t.preguntas.eyebrow}
          titulo={t.preguntas.titulo}
          className="lg:sticky lg:top-28 lg:self-start"
        />

        <div className="mt-14 max-w-[760px] border-t border-[var(--c-regla)] lg:mt-2 lg:max-w-none">
          {t.preguntas.items.map((item, index) => (
            <Pregunta
              key={item.pregunta}
              pregunta={item.pregunta}
              respuesta={item.respuesta}
              defaultOpen={index === 0}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
