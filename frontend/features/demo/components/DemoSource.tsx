import { displayHost } from '@/shared/lib/publicUrl';
import { newTabNotice } from '@/shared/lib/whatsapp';
import type { Locale } from '@/shared/lib/i18n/translations';
import { DEMO_PAGE_COPY } from '../copy';

interface Props {
  source: string | null;
  locale: Locale;
  className?: string;
  inline?: boolean;
}

export function DemoSource({ source, locale, className, inline = false }: Props) {
  const t = DEMO_PAGE_COPY[locale];
  if (!source) return null;
  const host = displayHost(source);
  const Wrapper = inline ? 'span' : 'p';
  return (
    <Wrapper className={className}>
      {t.publicInfoOnly}{' '}
      <a
        href={source}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${host} ${newTabNotice(locale)}`}
        className="link font-medium text-tinta"
      >
        {host}
      </a>
    </Wrapper>
  );
}
