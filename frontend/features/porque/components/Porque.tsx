'use client';

import { Container } from '@/shared/components/ui/Container';
import { EncabezadoSeccion } from '@/shared/components/ui/EncabezadoSeccion';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useRevelado } from '@/shared/hooks/useRevelado';
import { CasoIlustrativo } from './CasoIlustrativo';

type Retardo = React.CSSProperties & { '--d': string };

/**
 * Principios en filas con filete superior y, debajo, casos ilustrativos en lugar de las
 * "tarjetas de cifra grande": no hay datos reales que mostrar, así que no se inventan.
 */
export function Porque() {
  const { t } = useTranslation();
  const principios = useRevelado<HTMLUListElement>();
  const casos = useRevelado<HTMLUListElement>();

  return (
    <section id="porque" className="seccion">
      <Container>
        <EncabezadoSeccion numero="03" eyebrow={t.porque.eyebrow} titulo={t.porque.titulo} />

        <ul {...principios} className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-10 md:gap-y-14 lg:mt-[72px]">
          {t.porque.items.map((item, index) => (
            <li
              key={item.titulo}
              className="revelar flex flex-col gap-3 border-t border-tinta pt-5"
              style={{ '--d': `${index * 90}ms` } as Retardo}
            >
              <h3 className="text-[1.5rem] leading-[1.15] lg:text-[1.625rem]">{item.titulo}</h3>
              <p className="text-[0.9375rem] text-tinta-media">{item.descripcion}</p>
            </li>
          ))}
        </ul>

        <ul {...casos} className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-24">
          {t.porque.casos.items.map((caso, index) => (
            <CasoIlustrativo
              key={caso.titulo}
              indice={index}
              rotulo={t.porque.casos.rotulo}
              titulo={caso.titulo}
              hoyLabel={t.porque.casos.hoyLabel}
              hoy={caso.hoy}
              conIaLabel={t.porque.casos.conIaLabel}
              conIa={caso.conIa}
            />
          ))}
        </ul>
      </Container>
    </section>
  );
}
