'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Container } from '@/shared/components/ui/Container';
import { ChatIdentity } from '@/shared/components/ui/chat/ChatIdentity';
import { Conversation, type DemoConversationOptions } from '@/shared/components/ui/chat/Conversation';
import { DEMO_MAX_CHARS, fetchTenantInfo } from '@/shared/components/ui/chat/api';
import type { EndedKind } from '@/shared/components/ui/chat/endedReply';
import { CHAT_COPY, DEMO_COPY } from '@/shared/components/ui/chat/copy';
import { CONTACT_INFO } from '@/shared/constants';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { demoTenantId, parseDemoHash } from '@/shared/lib/demoSlug';
import { bookingUrl, buildBookingMessage, buildTakedownMessage, formatExpiry, pickSuggestions, shouldShowBookingBar, shouldShowDisclaimer } from '../lib/demoView';
import { findSectorDemo, isDemoSector } from '../data/sectorDemos';
import { DEMO_PAGE_COPY } from '../copy';
import { DemoBelowFold, DemoCompactHeader, DemoContextPanel, type DemoHeading } from './DemoContext';
import { phaseForHash, phaseFromInfo, phaseOnEnded, type DemoState } from '../lib/demoPhase';
import { DemoGallery } from './DemoGallery';
import { DemoNotice } from './DemoNotice';
import { StickyBookingBar } from './StickyBookingBar';

export function DemoAssistant() {
  const { locale } = useTranslation();
  const t = DEMO_PAGE_COPY[locale];
  const [view, setView] = useState<DemoState>({ phase: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [userMessages, setUserMessages] = useState(0);
  const [endedKind, setEndedKind] = useState<EndedKind | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setUserMessages(0);
      setEndedKind(null);
      const hash = parseDemoHash(window.location.hash);
      const immediate = phaseForHash(hash);
      if (immediate) return setView(immediate);
      if (hash.kind !== 'slug') return;
      setView({ phase: 'loading' });
      const result = await fetchTenantInfo(demoTenantId(hash.slug), controller.signal);
      if (controller.signal.aborted) return;
      setView(phaseFromInfo(hash.slug, result));
    };
    void load();
    const onHashChange = () => setAttempt((n) => n + 1);
    window.addEventListener('hashchange', onHashChange);
    return () => {
      controller.abort();
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [attempt]);

  const handleProgress = useCallback<NonNullable<DemoConversationOptions['onProgress']>>(
    ({ userMessages: count, ended }) => {
      setUserMessages(count);
      setEndedKind(ended);
      setView((v) => phaseOnEnded(v, ended));
    },
    [],
  );

  const isConversation = view.phase === 'ok' || view.phase === 'resting';
  const conversation = isConversation ? view : null;
  const slug = conversation?.slug ?? '';
  const info = conversation?.info ?? null;
  const sectorDemo = findSectorDemo(slug);
  const isSectorExample = info?.type === 'demo_sector';
  const sectorKey = info && isDemoSector(info.sector) ? info.sector : (sectorDemo?.sector ?? null);

  const whatsappHref = (message: string) => bookingUrl(CONTACT_INFO.whatsapp, message);
  const genericHref = whatsappHref(t.genericMessage);

  const bookingHref = useMemo(() => {
    if (!info) return '';
    const subject = isSectorExample ? t.sectorMessageSubject(info.businessName) : info.businessName;
    return bookingUrl(CONTACT_INFO.whatsapp, buildBookingMessage(locale, subject, slug));
  }, [info, isSectorExample, locale, slug, t]);

  const heading: DemoHeading | null = info
    ? {
        name: info.businessName,
        isSectorExample,
        sectorLabel: sectorKey ? t.sectorLabel[sectorKey] : null,
        expires: formatExpiry(info.expires),
        resting: view.phase === 'resting',
        source: info.source,
        consulted: info.consulted,
        showDisclaimer: shouldShowDisclaimer(info.type),
        takedownHref: whatsappHref(buildTakedownMessage(locale, info.businessName, slug)),
      }
    : null;

  const demoOptions: DemoConversationOptions = { maxChars: DEMO_MAX_CHARS, bookingHref, onProgress: handleProgress };

  return (
    <div className={isConversation ? 'pt-[4.25rem] lg:pb-32 lg:pt-36' : 'pb-24 pt-28 lg:pb-32 lg:pt-36'}>
      {view.phase === 'loading' && (
        <Container>
          <p role="status" className="eyebrow">
            {t.loading}
          </p>
        </Container>
      )}

      {view.phase === 'gallery' && (
        <Container>
          <DemoGallery askOwnHref={whatsappHref(t.gallery.askOwnMessage)} locale={locale} />
        </Container>
      )}

      {(view.phase === 'unavailable' || view.phase === 'error') && (
        <Container>
          <DemoNotice
            kind={view.phase}
            href={genericHref}
            locale={locale}
            onRetry={() => setAttempt((n) => n + 1)}
          />
        </Container>
      )}

      {conversation && info && heading && (
        <Container>
          <div className="lg:grid lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-16 xl:gap-24">
            <aside className="hidden lg:sticky lg:top-32 lg:block lg:self-start">
              <DemoContextPanel heading={heading} bookingHref={bookingHref} locale={locale} />
            </aside>

            <div className="-mx-5 flex h-[calc(100dvh-4.25rem)] flex-col sm:-mx-8 lg:mx-0 lg:h-[min(46rem,calc(100dvh-11rem))]">
              <div className="lg:hidden">
                <DemoCompactHeader heading={heading} locale={locale} />
              </div>
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden border-y border-[var(--regla-arena)] bg-papel lg:rounded-[4px] lg:border">
                <div className="border-b border-regla px-4 py-3 sm:px-5">
                  <ChatIdentity name={info.businessName} statusLabel={isSectorExample ? CHAT_COPY[locale].status : DEMO_COPY[locale].prospectStatus} />
                </div>
                <Conversation
                  key={slug}
                  tenant={demoTenantId(slug)}
                  welcome={
                    isSectorExample
                      ? DEMO_COPY[locale].welcome(info.businessName)
                      : DEMO_COPY[locale].prospectWelcome(info.businessName)
                  }
                  suggestions={pickSuggestions(info.suggestions, DEMO_COPY[locale].suggestions)}
                  showFooter={false}
                  whatsappFallback={false}
                  demo={demoOptions}
                />
              </div>
              {shouldShowBookingBar(userMessages, endedKind) && <StickyBookingBar href={bookingHref} locale={locale} />}
            </div>
          </div>
          <div className="-mx-5 sm:-mx-8 lg:mx-0">
            <DemoBelowFold bookingHref={bookingHref} locale={locale} />
          </div>
        </Container>
      )}
    </div>
  );
}
