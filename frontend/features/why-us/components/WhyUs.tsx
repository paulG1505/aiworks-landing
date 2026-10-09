'use client';

import { Container } from '@/shared/components/ui/Container';
import { EncabezadoSeccion } from '@/shared/components/ui/EncabezadoSeccion';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useRevelado } from '@/shared/hooks/useRevelado';
import { CarruselEjemplos } from './CarruselEjemplos';

type Retardo = React.CSSProperties & { '--d': string };

/**
 * Principios en filas con filete superior y, debajo, un carrusel de ejemplos de
 * automatización en lugar de las "tarjetas de cifra grande": no hay datos reales que
 * mostrar, así que no se inventan.
 */
export function Porque() {
  const { t } = useTranslation();
  const principios = useRevelado<HTMLUListElement>();
  const ejemplos = useRevelado();

  return (
    <section id="porque" className="seccion">
      <Container>
        <EncabezadoSeccion numero="04" eyebrow={t.porque.eyebrow} titulo={t.porque.titulo} />

        <ul {...principios} className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-10 md:gap-y-14 lg:mt-[72px]">
          {t.porque.items.map((item, index) => (
            <li
              key={item.titulo}
              className="revelar flex flex-col gap-3 border-t border-tinta pt-5"
              style={{ '--d': `${index * 90}ms` } as Retardo}
            >
              <h3 className="text-[1.375rem] leading-[1.2] lg:text-[1.625rem]">{item.titulo}</h3>
              <p className="text-tinta-media">{item.descripcion}</p>
            </li>
          ))}
        </ul>

        <div {...ejemplos} id="ejemplos" className="mt-24 scroll-mt-24 lg:mt-32">
          <CarruselEjemplos
            titulo={t.porque.casos.titulo}
            anterior={t.porque.casos.anterior}
            siguiente={t.porque.casos.siguiente}
            hoyLabel={t.porque.casos.hoyLabel}
            conIaLabel={t.porque.casos.conIaLabel}
            items={t.porque.casos.items}
          />
        </div>
      </Container>
    </section>
  );
}
