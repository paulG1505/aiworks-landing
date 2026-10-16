import { newTabNotice } from '@/shared/lib/whatsapp';
import type { Locale } from '@/shared/lib/i18n/translations';
import { SECTOR_DEMOS } from '../data/sectorDemos';
import { DEMO_PAGE_COPY } from '../copy';

interface Props {
  askOwnHref: string;
  locale: Locale;
}

export function DemoGallery({ askOwnHref, locale }: Props) {
  const t = DEMO_PAGE_COPY[locale];
  return (
    <div className="max-w-[48rem]">
      <h1 className="heading">{t.gallery.title}</h1>
      <p className="mt-6 max-w-[56ch] text-tinta-media">{t.gallery.intro}</p>

      <ul className="mt-12 border-t border-regla">
        {SECTOR_DEMOS.map((demo) => (
          <li key={demo.slug} className="border-b border-regla">
            <a
              href={`#${demo.slug}`}
              className="group flex min-h-11 items-center justify-between gap-6 py-6 transition-colors duration-150"
            >
              <span className="min-w-0">
                <span className="tabular block text-[0.8125rem] uppercase tracking-[0.08em] text-tinta-media">
                  {t.sectorLabel[demo.sector]}
                </span>
                <span className="mt-1 block font-display text-[1.375rem] font-semibold leading-tight text-tinta group-hover:text-marca">
                  {demo.businessName}
                </span>
                <span className="mt-1.5 block text-[0.9375rem] leading-snug text-tinta-media">
                  {t.gallery.sectorDescription[demo.sector]}
                </span>
              </span>
              <span className="shrink-0 text-[0.9375rem] font-medium text-marca underline decoration-1 underline-offset-4">
                {t.gallery.open}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-12 flex flex-col items-start gap-5">
        <p className="max-w-[48ch] text-[1.1875rem] leading-snug text-tinta">{t.gallery.askOwnText}</p>
        <a
          href={askOwnHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t.gallery.askOwn} ${newTabNotice(locale)}`}
          className="action action-primary min-h-11 !rounded-[4px]"
        >
          {t.gallery.askOwn}
        </a>
      </div>
    </div>
  );
}
