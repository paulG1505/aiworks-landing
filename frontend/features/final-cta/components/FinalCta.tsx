'use client';

import { Container } from '@/shared/components/ui/Container';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useRevelado } from '@/shared/hooks/useRevelado';
import { CONTACT_INFO } from '@/shared/constants';
import { enlaceWhatsApp, avisoPestanaNueva } from '@/shared/lib/whatsapp';

type Retardo = React.CSSProperties & { '--d': string };
const retardo = (ms: number): Retardo => ({ '--d': `${ms}ms` });

/**
 * Cierre: banda oscura con un solo CTA. El correo es texto secundario, no un segundo
 * botón, y el número queda visible para quien prefiera llamar o guardarlo.
 *
 * Segundo y último momento cinemático: el fondo sube desde abajo como cortina
 * (clip-path, 800ms), luego el titular por líneas y el botón al final.
 *
 * El export estático no tiene backend: el CTA lleva directo a WhatsApp, con el mensaje
 * prellenado según el idioma, y el correo es un mailto.
 */
export function CTAFinal() {
  const { t, locale } = useTranslation();
  const revelado = useRevelado<HTMLElement>();

  return (
    <section id="contacto" {...revelado} className="oscuro cortina">
      {/* Desde lg: titular a la izquierda; párrafo, CTA y contacto a la derecha. */}
      <Container className="pb-24 pt-32 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-16 lg:pb-40 lg:pt-[200px]">
        <div className="flex flex-col items-start gap-6">
          <p className="eyebrow revelar" style={retardo(300)}>
            <span>
              <span className="tabular">06</span> — {t.cta.eyebrow}
            </span>
          </p>

          <h2 className="max-w-[16ch] text-[clamp(2.25rem,1.3rem+3.8vw,4rem)] leading-[1.02] tracking-[-0.03em]">
            <span className="linea-mascara revelar-mascara">
              <span className="linea" style={retardo(400)}>
                {t.cta.titulo.antes}
              </span>
            </span>
            <span className="linea-mascara revelar-mascara">
              <span className="linea clave" style={retardo(520)}>
                {t.cta.titulo.clave}
              </span>
            </span>
          </h2>
        </div>

        <div className="mt-6 flex flex-col items-start gap-6 lg:mt-0">
          <p className="medida revelar text-[var(--hueso-tenue)]" style={retardo(640)}>
            {t.cta.description}
          </p>

          <a
            href={enlaceWhatsApp(locale)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t.cta.whatsapp} ${avisoPestanaNueva(locale)}`}
            className="accion accion-primaria revelar mt-4 w-full px-[32px] py-5 text-[1.1875rem] sm:mt-6 sm:w-auto lg:mt-2"
            style={retardo(800)}
          >
            {t.cta.whatsapp}
          </a>

          <p
            className="revelar flex flex-col gap-2 font-mono text-[0.9375rem] text-hueso-medio sm:flex-row sm:flex-wrap sm:gap-6"
            style={retardo(900)}
          >
            <span className="tabular">{CONTACT_INFO.phone}</span>
            <span>
              {t.cta.correoLabel}{' '}
              <a href={`mailto:${CONTACT_INFO.email}`} className="enlace break-all text-hueso">
                {CONTACT_INFO.email}
              </a>
            </span>
          </p>
        </div>
      </Container>
    </section>
  );
}
