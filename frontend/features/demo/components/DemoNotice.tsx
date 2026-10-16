import { newTabNotice } from '@/shared/lib/whatsapp';
import type { Locale } from '@/shared/lib/i18n/translations';
import { DEMO_PAGE_COPY } from '../copy';

interface Props {
  kind: 'unavailable' | 'error';
  href: string;
  locale: Locale;
  onRetry?: () => void;
}

export function DemoNotice({ kind, href, locale, onRetry }: Props) {
  const t = DEMO_PAGE_COPY[locale];
  const isError = kind === 'error';
  return (
    <div className="flex max-w-[40rem] flex-col items-start gap-5">
      <h1 className="heading-3">{isError ? t.error : t.unavailable}</h1>
      <p className="text-tinta-media">{isError ? t.errorText : t.unavailableText}</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t.whatsapp} ${newTabNotice(locale)}`}
          className="action action-primary min-h-11 !rounded-[4px]"
        >
          {t.whatsapp}
        </a>
        {isError && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="action action-outline min-h-11 cursor-pointer !rounded-[4px]"
          >
            {t.retryLoad}
          </button>
        )}
      </div>
    </div>
  );
}
