import { newTabNotice } from '@/shared/lib/whatsapp';
import type { Locale } from '@/shared/lib/i18n/translations';
import { DEMO_PAGE_COPY } from '../copy';

interface Props {
  href: string;
  locale: Locale;
}

export function StickyBookingBar({ href, locale }: Props) {
  const t = DEMO_PAGE_COPY[locale];
  return (
    <div className="border-t border-regla bg-papel px-5 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] pt-3 sm:px-8 lg:hidden">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${t.book} ${newTabNotice(locale)}`}
        className="action action-primary min-h-11 w-full !rounded-[4px] !py-3"
      >
        {t.bookShort}
      </a>
    </div>
  );
}
