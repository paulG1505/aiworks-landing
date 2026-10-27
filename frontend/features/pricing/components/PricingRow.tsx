import type { Locale } from '@/shared/lib/i18n/translations';
import { whatsappTextLink, newTabNotice } from '@/shared/lib/whatsapp';

interface PricingRowProps {
  index: number;
  name: string;
  amount: string;
  detail: string;
  cta?: { label: string; message: string };
  locale: Locale;
}

const STAGGER_MS = 70;

export function PricingRow({ index, name, amount, detail, cta, locale }: PricingRowProps) {
  const delay = index * STAGGER_MS;

  return (
    <li
      className="reveal-rule grid grid-cols-1 gap-y-3 py-7 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1.2fr)] md:items-baseline md:gap-x-6"
      style={{ '--d': `${delay}ms` } as React.CSSProperties}
    >
      <h3 className="reveal heading-3" style={{ '--d': `${delay + 100}ms` } as React.CSSProperties}>
        {name}
      </h3>

      <p className="reveal tabular text-xl font-medium text-tinta" style={{ '--d': `${delay + 130}ms` } as React.CSSProperties}>
        {amount}
      </p>

      <div className="reveal flex flex-col items-start gap-4" style={{ '--d': `${delay + 160}ms` } as React.CSSProperties}>
        <p className="text-tinta-media">{detail}</p>
        {cta && (
          <a
            href={whatsappTextLink(cta.message)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${cta.label} ${newTabNotice(locale)}`}
            className="link text-base font-medium text-tinta"
          >
            {cta.label}
          </a>
        )}
      </div>
    </li>
  );
}
