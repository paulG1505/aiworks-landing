import type { Locale } from '@/shared/lib/i18n/translations';
import { enlaceWhatsApp, avisoPestanaNueva } from '@/shared/lib/whatsapp';

interface ProcesoFilaProps {
  numero: string;
  titulo: string;
  hoy: string;
  resuelve: string;
  ctaLabel: string;
  locale: Locale;
}

export function ProcesoFila({ numero, titulo, hoy, resuelve, ctaLabel, locale }: ProcesoFilaProps) {
  // Etiqueta de "así se resuelve": no existe una clave de i18n para esto (están
  // congeladas), así que se deriva del locale activo aquí mismo. Sentence case,
  // nunca versalitas — se distingue con peso y color, no con mayúsculas.
  const resuelveLabel = locale === 'en' ? "How it's solved" : 'Así se resuelve';

  const whatsappUrl = enlaceWhatsApp(locale, titulo);
  const whatsappAriaLabel =
    locale === 'en'
      ? `Talk about ${titulo} on WhatsApp ${avisoPestanaNueva(locale)}`
      : `Hablar por WhatsApp sobre ${titulo} ${avisoPestanaNueva(locale)}`;

  return (
    <div className="fila grid grid-cols-1 gap-y-4 sm:grid-cols-[3.5rem_1fr] sm:gap-x-8">
      <div
        className="tabular text-tinta-media"
        style={{ fontSize: 'var(--paso--1)' }}
      >
        {numero}
      </div>

      <div className="flex flex-col items-start gap-4">
        <h3 className="text-tinta" style={{ fontSize: 'var(--paso-2)' }}>
          {titulo}
        </h3>

        <p className="medida text-tinta">{hoy}</p>

        <p className="medida text-tinta">
          <span className="font-medium text-tinta-media">{resuelveLabel}: </span>
          {resuelve}
        </p>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={whatsappAriaLabel}
          className="enlace"
        >
          {ctaLabel}
        </a>
      </div>
    </div>
  );
}
