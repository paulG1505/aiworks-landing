'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/shared/components/ui/Container';
import { Conversacion } from '@/shared/components/ui/chat/Conversacion';
import { pedirInfo, type InfoTenant } from '@/shared/components/ui/chat/api';
import { TEXTOS_DEMO } from '@/shared/components/ui/chat/textos';
import { CONTACT_INFO } from '@/shared/constants';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { avisoPestanaNueva } from '@/shared/lib/whatsapp';
import type { Locale } from '@/shared/lib/i18n/translations';

type Estado =
  | { fase: 'cargando' }
  | { fase: 'ok'; codigo: string; info: InfoTenant }
  | { fase: 'no-disponible' }
  | { fase: 'error' };

const CODIGO_VALIDO = /^[a-z0-9]{6,40}$/i;

const T = {
  es: {
    franja: (vence: string | null) =>
      `Demo · así respondería su asistente de WhatsApp${vence ? ` · vence el ${vence}` : ''}`,
    cargando: 'Preparando su demo…',
    noDisponible: 'Esta demo ya no está disponible',
    noDisponibleTexto: 'Escríbanos por WhatsApp y le preparamos una nueva.',
    error: 'No pudimos cargar la demo',
    errorTexto: 'Intente de nuevo en unos minutos o escríbanos por WhatsApp.',
    whatsapp: 'Escribirnos por WhatsApp',
    precio: 'Instalación USD 300 + IVA (precio de fundador) · planes desde USD 45 + IVA al mes',
    cta: 'Hablar por WhatsApp',
    ctaTitulo: 'Si le gustó',
    mensaje: (negocio: string) =>
      `Hola, vi la demo del asistente de ${negocio} y quiero saber cómo instalarlo en mi negocio.`,
    mensajeGenerico: 'Hola, quisiera una demo de un asistente de WhatsApp para mi negocio.',
  },
  en: {
    franja: (vence: string | null) =>
      `Demo · how your WhatsApp assistant would answer${vence ? ` · expires ${vence}` : ''}`,
    cargando: 'Preparing your demo…',
    noDisponible: 'This demo is no longer available',
    noDisponibleTexto: "Message us on WhatsApp and we'll set up a new one.",
    error: "We couldn't load the demo",
    errorTexto: 'Try again in a few minutes or message us on WhatsApp.',
    whatsapp: 'Message us on WhatsApp',
    precio: 'Setup USD 300 + VAT (founder price) · plans from USD 45 + VAT per month',
    cta: 'Talk on WhatsApp',
    ctaTitulo: 'If you liked it',
    mensaje: (negocio: string) =>
      `Hi, I saw the ${negocio} assistant demo and I'd like to know how to set it up for my business.`,
    mensajeGenerico: "Hi, I'd like a demo of a WhatsApp assistant for my business.",
  },
} satisfies Record<Locale, unknown>;

/** "2026-11-15" → "15/11" (en inglés, "11/15" no: se mantiene dd/mm, como pide el 4a). */
function fechaCorta(iso: string | null): string | null {
  const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}/${m[2]}` : null;
}

function leerCodigo(): string | null {
  const c = window.location.hash.replace(/^#/, '').trim();
  return CODIGO_VALIDO.test(c) ? c : null;
}

/**
 * Página de demo (`/demo#<código>`). Con `output: "export"` no hay rutas dinámicas, así
 * que el código viaja en el hash. El hash nunca llega a ningún servidor ni a un log.
 */
export function DemoAsistente() {
  const { locale } = useTranslation();
  const t = T[locale];
  const [estado, setEstado] = useState<Estado>({ fase: 'cargando' });
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const control = new AbortController();
    const cargar = async () => {
      const codigo = leerCodigo();
      if (!codigo) {
        setEstado({ fase: 'no-disponible' });
        return;
      }
      setEstado({ fase: 'cargando' });
      const r = await pedirInfo(`demo-${codigo}`, control.signal);
      if (control.signal.aborted) return;
      if (r.estado === 'ok') setEstado({ fase: 'ok', codigo, info: r.info });
      else setEstado({ fase: r.estado === 'no-disponible' ? 'no-disponible' : 'error' });
    };
    void cargar();
    const alCambiarHash = () => setIntento((n) => n + 1);
    window.addEventListener('hashchange', alCambiarHash);
    return () => {
      control.abort();
      window.removeEventListener('hashchange', alCambiarHash);
    };
  }, [intento]);

  const enlace = (texto: string) =>
    `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(texto)}`;

  return (
    <div className="pb-24 pt-28 lg:pb-32 lg:pt-36">
      <Container>
        <div className="mx-auto flex max-w-[680px] flex-col">
          {estado.fase === 'cargando' && (
            <p role="status" className="eyebrow">
              {t.cargando}
            </p>
          )}

          {(estado.fase === 'no-disponible' || estado.fase === 'error') && (
            <div className="flex flex-col items-start gap-5">
              <p className="eyebrow">Demo</p>
              <h1 className="titular-3">{estado.fase === 'error' ? t.error : t.noDisponible}</h1>
              <p className="text-tinta-media">
                {estado.fase === 'error' ? t.errorTexto : t.noDisponibleTexto}
              </p>
              <a
                href={enlace(t.mensajeGenerico)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t.whatsapp} ${avisoPestanaNueva(locale)}`}
                className="accion accion-primaria mt-2"
              >
                {t.whatsapp}
              </a>
            </div>
          )}

          {estado.fase === 'ok' && (
            <>
              <p className="eyebrow eyebrow-marcador border-y border-regla py-3.5">
                {t.franja(fechaCorta(estado.info.vence))}
              </p>
              <h1 className="titular mt-10 break-words">{estado.info.nombre_negocio}</h1>

              <div className="mt-10 flex h-[min(38rem,75dvh)] flex-col overflow-hidden rounded-lg border border-[var(--regla-arena)]">
                <Conversacion
                  key={estado.codigo}
                  tenant={`demo-${estado.codigo}`}
                  bienvenida={TEXTOS_DEMO[locale].bienvenida(estado.info.nombre_negocio)}
                  sugerencias={TEXTOS_DEMO[locale].sugerencias}
                  conPie={false}
                  respaldoWhatsapp={false}
                />
              </div>

              <div className="mt-14 flex flex-col items-start gap-5 border-t border-regla pt-8">
                <p className="eyebrow">{t.ctaTitulo}</p>
                <p className="max-w-[48ch] text-[1.1875rem] leading-snug text-tinta">{t.precio}</p>
                <a
                  href={enlace(t.mensaje(estado.info.nombre_negocio))}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t.cta} ${avisoPestanaNueva(locale)}`}
                  className="accion accion-primaria"
                >
                  {t.cta}
                </a>
              </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
