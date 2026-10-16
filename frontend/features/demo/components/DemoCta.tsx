import { newTabNotice } from '@/shared/lib/whatsapp';
import type { Locale } from '@/shared/lib/i18n/translations';
import { DEMO_PAGE_COPY } from '../copy';

interface Props {
  href: string;
  locale: Locale;
}

export function DemoCta({ href, locale }: Props) {
  const t = DEMO_PAGE_COPY[locale];
  return (
    <div className="flex flex-col items-start gap-3">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${t.book} ${newTabNotice(locale)}`}
        className="action action-primary min-h-11 !rounded-[4px]"
      >
        {t.book}
      </a>
      <p className="text-[0.9375rem] text-tinta-media">{t.bookNote}</p>
      <p className="mt-3 max-w-[40ch] border-t border-regla pt-4 text-[0.875rem] leading-snug text-tinta-media">
        {t.price}
      </p>
    </div>
  );
}
