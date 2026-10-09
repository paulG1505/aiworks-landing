'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/shared/components/ui/Container';
import { Conversation } from '@/shared/components/ui/chat/Conversation';
import { fetchTenantInfo, type TenantInfo } from '@/shared/components/ui/chat/api';
import { DEMO_TEXTS } from '@/shared/components/ui/chat/texts';
import { CONTACT_INFO } from '@/shared/constants';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { newTabNotice } from '@/shared/lib/whatsapp';
import type { Locale } from '@/shared/lib/i18n/translations';

type State =
  | { phase: 'loading' }
  | { phase: 'ok'; code: string; info: TenantInfo }
  | { phase: 'unavailable' }
  | { phase: 'error' };

const VALID_CODE = /^[a-z0-9]{6,40}$/i;

const COPY = {
  es: {
    banner: (expires: string | null) =>
      `Demo · así respondería su asistente de WhatsApp${expires ? ` · vence el ${expires}` : ''}`,
    loading: 'Preparando su demo…',
    unavailable: 'Esta demo ya no está disponible',
    unavailableText: 'Escríbanos por WhatsApp y le preparamos una nueva.',
    error: 'No pudimos cargar la demo',
    errorText: 'Intente de nuevo en unos minutos o escríbanos por WhatsApp.',
    whatsapp: 'Escribirnos por WhatsApp',
    price: 'Instalación USD 300 + IVA (precio de fundador) · planes desde USD 45 + IVA al mes',
    cta: 'Hablar por WhatsApp',
    ctaTitle: 'Si le gustó',
    message: (business: string) =>
      `Hola, vi la demo del asistente de ${business} y quiero saber cómo instalarlo en mi negocio.`,
    genericMessage: 'Hola, quisiera una demo de un asistente de WhatsApp para mi negocio.',
  },
  en: {
    banner: (expires: string | null) =>
      `Demo · how your WhatsApp assistant would answer${expires ? ` · expires ${expires}` : ''}`,
    loading: 'Preparing your demo…',
    unavailable: 'This demo is no longer available',
    unavailableText: "Message us on WhatsApp and we'll set up a new one.",
    error: "We couldn't load the demo",
    errorText: 'Try again in a few minutes or message us on WhatsApp.',
    whatsapp: 'Message us on WhatsApp',
    price: 'Setup USD 300 + VAT (founder price) · plans from USD 45 + VAT per month',
    cta: 'Talk on WhatsApp',
    ctaTitle: 'If you liked it',
    message: (business: string) =>
      `Hi, I saw the ${business} assistant demo and I'd like to know how to set it up for my business.`,
    genericMessage: "Hi, I'd like a demo of a WhatsApp assistant for my business.",
  },
} satisfies Record<Locale, unknown>;

// "2026-11-15" becomes "15/11". English keeps dd/mm on purpose.
function shortDate(iso: string | null): string | null {
  const match = iso?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[3]}/${match[2]}` : null;
}

function readCode(): string | null {
  const code = window.location.hash.replace(/^#/, '').trim();
  return VALID_CODE.test(code) ? code : null;
}

// `/demo#<code>`: with `output: "export"` there are no dynamic routes, so the code travels
// in the hash, which never reaches a server or a log.
export function AssistantDemo() {
  const { locale } = useTranslation();
  const t = COPY[locale];
  const [state, setState] = useState<State>({ phase: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      const code = readCode();
      if (!code) {
        setState({ phase: 'unavailable' });
        return;
      }
      setState({ phase: 'loading' });
      const result = await fetchTenantInfo(`demo-${code}`, controller.signal);
      if (controller.signal.aborted) return;
      if (result.status === 'ok') setState({ phase: 'ok', code, info: result.info });
      else setState({ phase: result.status === 'unavailable' ? 'unavailable' : 'error' });
    };
    void load();
    const onHashChange = () => setAttempt((n) => n + 1);
    window.addEventListener('hashchange', onHashChange);
    return () => {
      controller.abort();
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [attempt]);

  const whatsappUrl = (text: string) =>
    `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(text)}`;

  return (
    <div className="pb-24 pt-28 lg:pb-32 lg:pt-36">
      <Container>
        <div className="mx-auto flex max-w-[680px] flex-col">
          {state.phase === 'loading' && (
            <p role="status" className="eyebrow">
              {t.loading}
            </p>
          )}

          {(state.phase === 'unavailable' || state.phase === 'error') && (
            <div className="flex flex-col items-start gap-5">
              <p className="eyebrow">Demo</p>
              <h1 className="titular-3">{state.phase === 'error' ? t.error : t.unavailable}</h1>
              <p className="text-tinta-media">
                {state.phase === 'error' ? t.errorText : t.unavailableText}
              </p>
              <a
                href={whatsappUrl(t.genericMessage)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t.whatsapp} ${newTabNotice(locale)}`}
                className="accion accion-primaria mt-2"
              >
                {t.whatsapp}
              </a>
            </div>
          )}

          {state.phase === 'ok' && (
            <>
              <p className="eyebrow eyebrow-marcador border-y border-regla py-3.5">
                {t.banner(shortDate(state.info.expires))}
              </p>
              <h1 className="titular mt-10 break-words">{state.info.businessName}</h1>

              <div className="mt-10 flex h-[min(38rem,75dvh)] flex-col overflow-hidden rounded-lg border border-[var(--regla-arena)]">
                <Conversation
                  key={state.code}
                  tenant={`demo-${state.code}`}
                  welcome={DEMO_TEXTS[locale].welcome(state.info.businessName)}
                  suggestions={DEMO_TEXTS[locale].suggestions}
                  showFooter={false}
                  whatsappFallback={false}
                />
              </div>

              <div className="mt-14 flex flex-col items-start gap-5 border-t border-regla pt-8">
                <p className="eyebrow">{t.ctaTitle}</p>
                <p className="max-w-[48ch] text-[1.1875rem] leading-snug text-tinta">{t.price}</p>
                <a
                  href={whatsappUrl(t.message(state.info.businessName))}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t.cta} ${newTabNotice(locale)}`}
                  className="accion accion-primaria"
                >
                  {t.cta}
                </a>
              </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
