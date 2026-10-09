import type { Locale } from '@/shared/lib/i18n/translations';
import { whatsappLink, newTabNotice } from '@/shared/lib/whatsapp';

interface ProcessRowProps {
  index: number;
  number: string;
  title: string;
  today: string;
  solution: string;
  ctaLabel: string;
  locale: Locale;
}

const STAGGER_MS = 70;

export function ProcessRow({ index, number, title, today, solution, ctaLabel, locale }: ProcessRowProps) {
  const solutionLabel = locale === 'en' ? "How it's solved" : 'Así se resuelve';

  const whatsappUrl = whatsappLink(locale, title);
  const whatsappAriaLabel =
    locale === 'en'
      ? `Talk about ${title} on WhatsApp ${newTabNotice(locale)}`
      : `Hablar por WhatsApp sobre ${title} ${newTabNotice(locale)}`;

  const delayMs = index * STAGGER_MS;

  return (
    <li
      className="revelar-regla grid grid-cols-1 gap-y-4 py-7 md:grid-cols-[64px_minmax(0,1fr)_minmax(0,1fr)] md:items-baseline md:gap-x-6"
      style={{ '--d': `${delayMs}ms` } as React.CSSProperties}
    >
      <span className="revelar tabular text-[0.8125rem] font-medium text-tinta-media" style={{ '--d': `${delayMs + 100}ms` } as React.CSSProperties}>
        {number}
      </span>

      <h3 className="revelar titular-3" style={{ '--d': `${delayMs + 100}ms` } as React.CSSProperties}>
        {title}
      </h3>

      <div className="revelar flex flex-col items-start gap-4" style={{ '--d': `${delayMs + 160}ms` } as React.CSSProperties}>
        <p className="text-tinta-media">{today}</p>
        <p className="text-tinta-media">
          <span className="font-medium text-tinta">{solutionLabel}: </span>
          {solution}
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
