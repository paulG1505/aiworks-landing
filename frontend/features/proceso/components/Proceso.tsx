'use client';

import { Container } from '@/shared/components/ui/Container';
import { EncabezadoSeccion } from '@/shared/components/ui/EncabezadoSeccion';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useProgresoFases } from '../hooks/useProgresoFases';
import { Fase } from './Fase';

/**
 * Primer bloque oscuro: cambia el clima justo cuando se pasa de qué hacemos a cómo.
 * Escritorio: tres columnas bajo una línea horizontal. Móvil: fases en vertical con la
 * línea a la izquierda.
 */
export function Proceso() {
  const { t } = useTranslation();
  const { ref, alcanzadas } = useProgresoFases(t.proceso.fases.length);

  return (
    <section id="proceso" className="oscuro seccion">
      <Container>
        <EncabezadoSeccion
          numero="02"
          eyebrow={t.proceso.eyebrow}
          titulo={t.proceso.titulo}
          intro={t.proceso.subtitle}
          introClassName="text-[var(--hueso-tenue)]"
        />

        <div ref={ref} className="relative mt-16 pl-6 md:mt-20 md:pl-0 md:pt-8">
          <div
            aria-hidden="true"
            className="absolute left-0 top-0 h-full w-px bg-[var(--pista-noche)] md:h-px md:w-full"
          >
            <div className="fases-progreso absolute inset-0 bg-hueso" />
          </div>

          <ol className="grid grid-cols-1 gap-14 md:grid-cols-3 md:gap-10">
            {t.proceso.fases.map((fase, index) => (
              <Fase
                key={fase.numero}
                alcanzada={index < alcanzadas}
                faseLabel={t.proceso.faseLabel}
                numero={fase.numero}
                titulo={fase.titulo}
                descripcion={fase.descripcion}
                entregable={fase.entregable}
                entregableLabel={t.proceso.entregableLabel}
              />
            ))}
          </ol>
        </div>

        <p className="mt-16 flex flex-col gap-1 font-mono text-[0.8125rem] text-hueso-medio sm:flex-row sm:gap-3 md:mt-20">
          <span>{t.proceso.stackLabel}</span>
          <span>{t.proceso.stack}</span>
        </p>
      </Container>
    </section>
  );
}
