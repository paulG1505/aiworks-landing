'use client';

import { Container } from '@/shared/components/ui/Container';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { CONTACT_INFO } from '@/shared/constants';
import { enlaceWhatsApp, avisoPestanaNueva } from '@/shared/lib/whatsapp';
import { RegistroOperativo } from './RegistroOperativo';

type Retardo = React.CSSProperties & { '--d': string };
const retardo = (ms: number): Retardo => ({ '--d': `${ms}ms` });

/**
 * Hero 1b de la dirección visual: la categoría ES la primera línea del titular (en
 * tinta media, con "inteligencia artificial" en cursiva) y el beneficio la segunda, en
 * tinta. El eyebrow queda libre para ubicación y público.
 *
 * Secuencia al cargar —la única cinemática sin scroll—: eyebrow en fundido → línea 1
 * del titular sube desde su máscara → línea 2 a +120ms → cuerpo y CTA a +200ms → el
 * registro escribe una línea cada 600ms (RegistroOperativo). Con movimiento reducido
 * todo está visible desde el principio.
 */
export function Hero() {
  const { t, locale } = useTranslation();
  const { categoria } = t.hero;

  return (
    <section className="pt-28 pb-24 sm:pt-36 lg:pt-48 lg:pb-40">
      {/* Desde xl, dos columnas: titular y CTA a la izquierda, registro a la derecha. */}
      <Container className="xl:grid xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] xl:items-end xl:gap-16">
        <div className="flex max-w-[900px] flex-col gap-4 sm:gap-6">
          <p className="eyebrow eyebrow-marcador entrada-fundido">{t.hero.eyebrow}</p>

          <h1 className="titular-display">
            <span className="linea-mascara entrada-mascara">
              <span className="linea text-tinta-media" style={retardo(250)}>
                {categoria.antes}
                <i className="clave">{categoria.clave}</i>
                {categoria.despues}
              </span>
            </span>
            <span className="linea-mascara entrada-mascara">
              <span className="linea" style={retardo(370)}>
                {t.hero.beneficio}
              </span>
            </span>
          </h1>

          <div className="entrada-revelar flex flex-col gap-6 sm:gap-10" style={retardo(570)}>
            <p className="medida mt-2 text-tinta-media lg:text-[1.1875rem]">{t.hero.subtitle}</p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <a
                href={enlaceWhatsApp(locale)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t.hero.cta.primary} ${avisoPestanaNueva(locale)}`}
                className="accion accion-primaria"
              >
                {t.hero.cta.primary}
              </a>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="enlace self-center p-2 text-[0.9375rem] font-medium sm:self-auto sm:p-0 sm:text-base"
              >
                {t.hero.cta.correo}
              </a>
            </div>

            <p className="text-[0.875rem] text-tinta-media">{t.hero.trayectoria}</p>
          </div>
        </div>

        <div className="mt-12 max-w-[760px] lg:mt-16 xl:mt-0 xl:max-w-none">
          <RegistroOperativo inicioMs={900} />
        </div>
      </Container>
    </section>
  );
}
