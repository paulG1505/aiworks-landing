'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { newTabNotice, whatsappLink } from '@/shared/lib/whatsapp';
import { MAX_CHARS } from './api';
import { ActionLink } from './ActionLink';
import { Composer } from './Composer';
import { CHAT_COPY } from './copy';
import { EndedNotice } from './EndedNotice';
import { shouldShowRemaining, type EndedKind } from './endedReply';
import { MessageBubble } from './MessageBubble';
import { SuggestionChips } from './SuggestionChips';
import { TypingIndicator } from './TypingIndicator';
import { useConversation } from './useConversation';

export interface DemoConversationOptions {
  maxChars: number;
  bookingHref: string;
  onProgress?: (progress: { userMessages: number; ended: EndedKind | null }) => void;
}

interface Props {
  tenant: string;
  welcome?: string;
  suggestions?: readonly string[];
  showFooter?: boolean;
  whatsappFallback?: boolean;
  autoFocus?: boolean;
  demo?: DemoConversationOptions;
}

export function Conversation({
  tenant,
  welcome,
  suggestions,
  showFooter = true,
  whatsappFallback = true,
  autoFocus = false,
  demo,
}: Props) {
  const { locale } = useTranslation();
  const copy = CHAT_COPY[locale];
  const maxChars = demo?.maxChars ?? MAX_CHARS;
  const { messages, sending, ended, remaining, userMessageCount, send, retry } = useConversation({
    tenant,
    locale,
    whatsappFallback,
    isDemo: Boolean(demo),
    maxChars,
  });
  const [text, setText] = useState('');
  const list = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const noticeRef = useRef<HTMLDivElement>(null);
  const onProgress = demo?.onProgress;

  useEffect(() => {
    if (autoFocus) fieldRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const el = list.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending, ended]);

  useEffect(() => {
    onProgress?.({ userMessages: userMessageCount, ended: ended?.kind ?? null });
  }, [onProgress, userMessageCount, ended]);

  const hasEnded = ended !== null;
  useEffect(() => {
    if (hasEnded) noticeRef.current?.focus();
  }, [hasEnded]);

  const submit = async (content: string) => {
    setText('');
    if (await send(content)) fieldRef.current?.focus();
  };

  const handleRetry = async (retryText: string) => {
    if (await retry(retryText)) fieldRef.current?.focus();
  };

  const options = suggestions ?? copy.suggestions;
  const hint = demo && shouldShowRemaining(remaining) ? copy.remaining(remaining) : null;
  const bookingLabel = `${copy.bookCall} ${newTabNotice(locale)}`;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        ref={list}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        className="chat-scroll flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-4 pb-3 pt-4 sm:px-5"
      >
        <MessageBubble role="assistant" speaker={copy.assistantRole}>
          {welcome ?? copy.welcome}
        </MessageBubble>

        {messages.length === 0 && (
          <SuggestionChips
            label={copy.suggestionsTitle}
            suggestions={options}
            disabled={sending || ended !== null}
            onPick={(s) => void submit(s)}
          />
        )}

        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            role={m.role}
            speaker={m.role === 'user' ? copy.userRole : copy.assistantRole}
            footer={
              m.action || m.failed ? (
                <div className="mt-3 flex flex-col items-start gap-2.5">
                  {m.action && (
                    <ActionLink
                      href={m.action.url}
                      ariaLabel={`${copy.continueOnWhatsapp} ${newTabNotice(locale)}`}
                    >
                      {copy.continueOnWhatsapp}
                    </ActionLink>
                  )}
                  {m.action?.code && (
                    <p className="text-[0.8125rem] text-tinta-media">
                      {copy.code}{' '}
                      <span className="tabular rounded-[4px] border border-[var(--regla-arena)] px-1.5 py-0.5 text-[0.8125rem] font-medium text-tinta">
                        {m.action.code}
                      </span>
                    </p>
                  )}
                  {m.failed && (
                    <button
                      type="button"
                      onClick={() => void handleRetry(m.retryText ?? '')}
                      disabled={sending}
                      className="min-h-11 cursor-pointer rounded-[4px] border border-[var(--regla-arena)] px-4 text-[0.9375rem] font-medium text-tinta transition-colors duration-150 hover:border-marca hover:text-marca disabled:cursor-default disabled:opacity-60"
                    >
                      {copy.retry}
                    </button>
                  )}
                </div>
              ) : undefined
            }
          >
            {m.text}
          </MessageBubble>
        ))}

        {sending && <TypingIndicator label={copy.typing} />}

        {ended && demo && (
          <EndedNotice ref={noticeRef} text={ended.text}>
            <ActionLink href={demo.bookingHref} ariaLabel={bookingLabel}>
              {copy.bookCall}
            </ActionLink>
          </EndedNotice>
        )}
      </div>

      <div className="border-t border-regla">
        {whatsappFallback && (
          <p className="px-4 pt-3 text-[0.8125rem] text-tinta-media sm:px-5">
            {copy.preferWhatsapp}{' '}
            <a
              href={whatsappLink(locale)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${copy.preferWhatsapp} ${copy.messageOnWhatsapp} ${newTabNotice(locale)}`}
              className="link font-medium text-tinta"
            >
              {copy.messageOnWhatsapp}
            </a>
          </p>
        )}
        <Composer
          value={text}
          onChange={setText}
          onSubmit={() => void submit(text)}
          fieldRef={fieldRef}
          maxChars={maxChars}
          fieldLabel={copy.fieldLabel}
          placeholder={ended ? copy.ended.placeholder : copy.placeholder}
          sendLabel={copy.send}
          charactersLabel={copy.characters}
          hint={hint}
          disabled={ended !== null}
          busy={sending}
        />
        {showFooter && (
          <div className="mx-4 mb-4 border-t border-regla pt-3 text-[0.75rem] leading-snug text-tinta-media sm:mx-5">
            <p>{copy.footerPrices}</p>
            <p className="mt-0.5 text-tinta">{copy.footerClosing}</p>
          </div>
        )}
      </div>
    </div>
  );
}
