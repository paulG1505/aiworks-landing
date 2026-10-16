import type { Locale } from '@/shared/lib/i18n/translations';
import { DEMO_PAGE_COPY } from '../copy';
import { DemoCta } from './DemoCta';
import { DemoDisclaimerDetail, DemoDisclaimerLine } from './DemoDisclaimer';
import { DemoSource } from './DemoSource';

export interface DemoHeading {
  name: string;
  isSectorExample: boolean;
  sectorLabel: string | null;
  expires: string | null;
  resting: boolean;
  source: string | null;
  consulted: string | null;
  showDisclaimer: boolean;
  takedownHref: string;
}

interface Props {
  heading: DemoHeading;
  bookingHref: string;
  locale: Locale;
}

function disclaimerProps(heading: DemoHeading) {
  return { name: heading.name, source: heading.source, consulted: heading.consulted, takedownHref: heading.takedownHref };
}

function Title({ heading, locale, className }: { heading: DemoHeading; locale: Locale; className: string }) {
  const t = DEMO_PAGE_COPY[locale];
  if (heading.isSectorExample) {
    const label = heading.sectorLabel ? `${t.exampleCompany} · ${heading.sectorLabel}` : t.exampleCompany;
    return <h1 className={className}>{label}</h1>;
  }
  return (
    <h1 className={className}>
      {t.prepared} <span className="highlight">{heading.name}</span>
    </h1>
  );
}

function Validity({ heading, locale }: { heading: DemoHeading; locale: Locale }) {
  const t = DEMO_PAGE_COPY[locale];
  const text = heading.resting ? t.resting : heading.expires ? t.expires(heading.expires) : null;
  return text ? <span className="tabular text-[0.8125rem] uppercase tracking-[0.08em]">{text}</span> : null;
}

export function DemoContextPanel({ heading, bookingHref, locale }: Props) {
  const t = DEMO_PAGE_COPY[locale];
  return (
    <div className="flex flex-col items-start gap-5">
      <Title heading={heading} locale={locale} className="break-words text-[2.25rem] leading-[1.08]" />
      {heading.isSectorExample && (
        <p className="rounded-[4px] border border-regla bg-arena px-4 py-3 text-[0.9375rem] leading-snug text-tinta">
          {t.sectorBanner}
        </p>
      )}
      {heading.showDisclaimer && (
        <DemoDisclaimerLine name={heading.name} locale={locale} className="max-w-[36ch] text-[0.9375rem] leading-snug text-tinta" />
      )}
      <p className="text-tinta-media">
        <Validity heading={heading} locale={locale} />
      </p>
      <DemoSource source={heading.source} locale={locale} className="max-w-[36ch] text-[0.9375rem] leading-snug text-tinta-media" />
      {heading.showDisclaimer && <DemoDisclaimerDetail {...disclaimerProps(heading)} locale={locale} />}
      <div className="mt-4 w-full border-t border-regla pt-8">
        <DemoCta href={bookingHref} locale={locale} />
      </div>
    </div>
  );
}

export function DemoCompactHeader({ heading, locale }: Omit<Props, 'bookingHref'>) {
  const t = DEMO_PAGE_COPY[locale];
  return (
    <div className="flex flex-col gap-1 px-5 py-3 sm:px-8">
      <Title heading={heading} locale={locale} className="break-words text-[1.25rem] leading-tight" />
      {heading.isSectorExample ? (
        <p className="text-[0.8125rem] leading-snug text-tinta-media">{t.sectorBanner}</p>
      ) : (
        <>
          {heading.showDisclaimer && (
            <DemoDisclaimerLine name={heading.name} locale={locale} className="text-[0.8125rem] leading-snug text-tinta" />
          )}
          <p className="text-[0.8125rem] leading-snug text-tinta-media">
            <Validity heading={heading} locale={locale} />
            {heading.source && heading.expires ? ' · ' : ''}
            <DemoSource source={heading.source} locale={locale} inline />
          </p>
          {heading.showDisclaimer && <DemoDisclaimerDetail {...disclaimerProps(heading)} locale={locale} />}
        </>
      )}
    </div>
  );
}

export function DemoBelowFold({ bookingHref, locale }: Omit<Props, 'heading'>) {
  return (
    <div className="border-t border-regla px-5 py-10 sm:px-8 lg:hidden">
      <DemoCta href={bookingHref} locale={locale} />
    </div>
  );
}
