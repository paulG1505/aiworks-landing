import type { Locale } from '@/shared/lib/i18n/translations';
import { enlaceWhatsApp, avisoPestanaNueva } from '@/shared/lib/whatsapp';

interface ProcesoFilaProps {
  indice: number;
  numero: string;
  titulo: string;
  hoy: string;
  resuelve: string;
  ctaLabel: string;
  locale: Locale;
}

const STAGGER_MS = 70;

/** Número · nombre (serif) · descripción. En móvil las tres columnas se apilan. */
export function ProcesoFila({ indice, numero, titulo, hoy, resuelve, ctaLabel, locale }: ProcesoFilaProps) {
  // Etiqueta de "así se resuelve": se deriva del locale activo aquí mismo.
  const resuelveLabel = locale === 'en' ? "How it's solved" : 'Así se resuelve';

  const whatsappUrl = enlaceWhatsApp(locale, titulo);
  const whatsappAriaLabel =
    locale === 'en'
      ? `Talk about ${titulo} on WhatsApp ${avisoPestanaNueva(locale)}`
      : `Hablar por WhatsApp sobre ${titulo} ${avisoPestanaNueva(locale)}`;

  const retardo = indice * STAGGER_MS;

  return (
    <li
      className="revelar-regla grid grid-cols-1 gap-y-4 py-7 md:grid-cols-[64px_minmax(0,1fr)_minmax(0,1fr)] md:items-baseline md:gap-x-6"
      style={{ '--d': `${retardo}ms` } as React.CSSProperties}
    >
      <span className="revelar tabular text-[0.8125rem] font-medium text-tinta-media" style={{ '--d': `${retardo + 100}ms` } as React.CSSProperties}>
        {numero}
      </span>

      <h3 className="revelar titular-3" style={{ '--d': `${retardo + 100}ms` } as React.CSSProperties}>
        {titulo}
      </h3>

      <div className="revelar flex flex-col items-start gap-4" style={{ '--d': `${retardo + 160}ms` } as React.CSSProperties}>
        <p className="text-tinta-media">{hoy}</p>
        <p className="text-tinta-media">
          <span className="font-medium text-tinta">{resuelveLabel}: </span>
          {resuelve}
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={whatsappAriaLabel}
          className="enlace text-base font-medium text-tinta"
        >
          {ctaLabel}
        </a>
      </div>
    </li>
  );
}
