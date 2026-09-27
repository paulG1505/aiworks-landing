'use client';

import { Container } from '@/shared/components/ui/Container';
import { EncabezadoSeccion } from '@/shared/components/ui/EncabezadoSeccion';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useRevelado } from '@/shared/hooks/useRevelado';
import { ProcesoFila } from './ProcesoFila';

/**
 * Índice editorial con filetes, no tarjetas ni iconos. Al revelarse, el filete de cada
 * fila se dibuja de izquierda a derecha y su texto aparece 100ms después, con 70ms
 * entre filas: se lee como si el inventario se estuviera escribiendo.
 */
export function Procesos() {
  const { t, locale } = useTranslation();
  const revelado = useRevelado<HTMLOListElement>();

  return (
    <section id="procesos" className="seccion">
      <Container>
        <EncabezadoSeccion numero="01" eyebrow={t.procesos.eyebrow} titulo={t.procesos.titulo} />

        <p className="medida mt-8 text-tinta-media">{t.procesos.subtitle}</p>

        <ol {...revelado} className="mt-14 border-b border-regla lg:mt-[72px]">
          {t.procesos.items.map((item, index) => (
            <ProcesoFila
              key={item.numero}
              indice={index}
              numero={item.numero}
              titulo={item.titulo}
              hoy={item.hoy}
              resuelve={item.resuelve}
              ctaLabel={t.procesos.ctaItem}
              locale={locale}
            />
          ))}
        </ol>
      </Container>
    </section>
  );
}
