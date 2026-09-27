'use client';

import { Container } from '@/shared/components/ui/Container';
import { EncabezadoSeccion } from '@/shared/components/ui/EncabezadoSeccion';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Pregunta } from './Pregunta';

/** Fondo arena: separa del bloque claro anterior sin gastar un segundo oscuro. */
export function Preguntas() {
  const { t } = useTranslation();

  return (
    <section id="preguntas" className="seccion bg-arena [--c-regla:var(--regla-arena)]">
      <Container>
        <EncabezadoSeccion numero="04" eyebrow={t.preguntas.eyebrow} titulo={t.preguntas.titulo} />

        <div className="mt-14 max-w-[760px] border-t border-[var(--c-regla)] lg:mt-16">
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
