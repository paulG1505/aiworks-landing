'use client';

import { useId, useState } from 'react';
import { displayHost } from '@/shared/lib/publicUrl';
import { newTabNotice } from '@/shared/lib/whatsapp';
import type { Locale } from '@/shared/lib/i18n/translations';
import { DEMO_PAGE_COPY } from '../copy';
import { formatConsulted } from '../lib/demoView';

interface Props {
  name: string;
  source: string | null;
  consulted: string | null;
  takedownHref: string;
  locale: Locale;
}

export function DemoDisclaimerLine({ name, locale, className }: Pick<Props, 'name' | 'locale'> & { className: string }) {
  return <p className={className}>{DEMO_PAGE_COPY[locale].disclaimer.line(name)}</p>;
}

export function DemoDisclaimerDetail({ name, source, consulted, takedownHref, locale }: Props) {
  const t = DEMO_PAGE_COPY[locale];
  const d = t.disclaimer;
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const consultedDate = formatConsulted(consulted);
  const host = source ? displayHost(source) : null;
  return (
    <div className="w-full">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-[0.9375rem] font-medium text-tinta underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca"
      >
        <span aria-hidden="true">ⓘ</span>
        {d.toggle}
      </button>
      <div id={panelId} hidden={!open} className="mt-1 flex max-w-[36ch] flex-col gap-3 text-[0.9375rem] leading-snug text-tinta-media">
        <p>
          {d.sourceBefore}{' '}
          {source && host ? (
            <a
              href={source}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${host} ${newTabNotice(locale)}`}
              className="link font-medium text-tinta"
            >
              {host}
            </a>
          ) : (
            t.sourceFallback
          )}
          {consultedDate ? d.consultedOn(consultedDate) : ''}
          {d.sourceAfter}
        </p>
        <p>{d.notAffiliated(name)}</p>
        <p>{d.example}</p>
        <p>{d.takedownIntro(name)}</p>
        <a
          href={takedownHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${d.takedownAction} ${newTabNotice(locale)}`}
          className="action action-outline min-h-11 !rounded-[4px] self-start"
        >
          {d.takedownAction}
        </a>
      </div>
    </div>
  );
}
