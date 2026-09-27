'use client';

import { Container } from '@/shared/components/ui/Container';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Pregunta } from './Pregunta';

export function Preguntas() {
  const { t } = useTranslation();

  return (
    <section id="preguntas" className="bg-papel py-20 lg:py-32">
      <Container>
        <h2 className="text-[length:var(--paso-3)] text-tinta md:text-[length:var(--paso-4)]">
          {t.preguntas.title}
        </h2>
        <div className="mt-8 md:mt-10">
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
