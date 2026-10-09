'use client';

import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { newTabNotice, whatsappLink } from '@/shared/lib/whatsapp';
import {
  MAX_CHARS,
  sendMessage,
  saveSession,
  readSession,
  type ChatAction,
} from './api';
import { CHAT_COPY } from './copy';

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  action?: ChatAction | null;
}

interface Props {
  tenant: string;
  welcome?: string;
  suggestions?: readonly string[];
  showFooter?: boolean;
  whatsappFallback?: boolean;
  autoFocus?: boolean;
}

export function Conversation({
  tenant,
  welcome,
  suggestions,
  showFooter = true,
  whatsappFallback = true,
  autoFocus = false,
}: Props) {
  const { locale } = useTranslation();
  const copy = CHAT_COPY[locale];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const fieldId = useId();
  const counterId = useId();
  const list = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const nextId = useRef(1);
  const session = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const welcomeText = welcome ?? copy.welcome;
  const options = suggestions ?? copy.suggestions;
  const isEmpty = messages.length === 0;

  useEffect(() => {
    session.current = readSession(tenant);
    const controller = new AbortController();
    abortRef.current = controller;
    return () => controller.abort();
  }, [tenant]);

  useEffect(() => {
    if (autoFocus) fieldRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const el = list.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending]);

  useEffect(() => {
    const el = fieldRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
  }, [text]);

  const addMessage = (m: Omit<ChatMessage, 'id'>) =>
    setMessages((previous) => [...previous, { ...m, id: nextId.current++ }]);

  const send = async (content: string) => {
    const message = content.trim();
    if (!message || sending || message.length > MAX_CHARS) return;
    addMessage({ role: 'user', text: message });
    setText('');
    setSending(true);

    const result = await sendMessage(
      tenant,
      { sessionId: session.current, message, language: locale },
      abortRef.current?.signal,
    );
    if (abortRef.current?.signal.aborted) return;

    if (result.ok) {
      if (result.sessionId) {
        session.current = result.sessionId;
        saveSession(tenant, result.sessionId);
      }
      addMessage({ role: 'assistant', text: result.reply, action: result.action });
    } else if (whatsappFallback) {
      addMessage({
        role: 'assistant',
        text: copy.fallback,
        action: { kind: 'whatsapp', url: whatsappLink(locale), code: null },
      });
    } else {
      addMessage({ role: 'assistant', text: copy.fallbackNoWhatsapp });
    }
    setSending(false);
    fieldRef.current?.focus();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(text);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void send(text);
    }
  };

  const remaining = MAX_CHARS - text.length;
  const nearLimit = remaining <= 100;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        ref={list}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-2 pt-1"
      >
        <MessageRow role="assistant" label={copy.assistantRole} first>
          {welcomeText}
        </MessageRow>

        {isEmpty && (
          <div className="mt-5">
            <p className="eyebrow !text-[0.6875rem]">{copy.suggestionsTitle}</p>
            <ul className="mt-3">
              {options.map((s) => (
                <li key={s} className="border-t border-regla last:border-b">
                  <button
                    type="button"
                    onClick={() => void send(s)}
                    disabled={sending}
                    className="w-full cursor-pointer py-3 text-left text-[0.9375rem] leading-snug text-tinta transition-colors duration-150 hover:text-marca disabled:cursor-default"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {messages.map((m) => (
          <MessageRow
            key={m.id}
            role={m.role}
            label={m.role === 'user' ? copy.userRole : copy.assistantRole}
          >
            {m.text}
            {m.action && (
              <div className="mt-4 flex flex-col items-start gap-2.5">
                <a
                  href={m.action.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${copy.continueOnWhatsapp} ${newTabNotice(locale)}`}
                  className="action action-primary !px-5 !py-3 !text-[0.9375rem]"
                >
                  {copy.continueOnWhatsapp}
                </a>
                {m.action.code && (
                  <p className="text-[0.8125rem] text-tinta-media">
                    {copy.code}{' '}
                    <span className="tabular rounded-sm border border-regla px-1.5 py-0.5 text-[0.8125rem] font-medium text-tinta">
                      {m.action.code}
                    </span>
                  </p>
                )}
              </div>
            )}
          </MessageRow>
        ))}

        {sending && (
          <div className="chat-message border-t border-regla py-4" role="status">
            <p className="eyebrow !text-[0.6875rem]">{copy.assistantRole}</p>
            <p className="mt-2 flex items-center gap-2 text-[0.875rem] text-tinta-media">
              <span className="flex gap-1" aria-hidden="true">
                <span className="typing-dot" style={{ ['--d' as string]: '0ms' }} />
                <span className="typing-dot" style={{ ['--d' as string]: '160ms' }} />
                <span className="typing-dot" style={{ ['--d' as string]: '320ms' }} />
              </span>
              {copy.typing}
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-regla px-5 pb-4 pt-4">
        {whatsappFallback && (
          <p className="mb-3 text-[0.8125rem] text-tinta-media">
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
        <label htmlFor={fieldId} className="sr-only">
          {copy.fieldLabel}
        </label>
        <textarea
          id={fieldId}
          ref={fieldRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={copy.placeholder}
          aria-describedby={counterId}
          maxLength={MAX_CHARS}
          className="block max-h-[132px] w-full resize-none rounded-md border border-[var(--regla-arena)] bg-transparent px-3.5 py-3 text-[1rem] leading-snug text-tinta placeholder:text-tinta-media focus:border-marca focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca"
        />
        <div className="mt-3 flex items-center justify-between gap-4">
          <p
            id={counterId}
            aria-label={copy.characters(text.length, MAX_CHARS)}
            className={`tabular text-[0.75rem] ${nearLimit ? 'text-tinta' : 'text-tinta-media'}`}
          >
            {text.length}/{MAX_CHARS.toLocaleString('es-EC')}
          </p>
          <button
            type="submit"
            disabled={sending || !text.trim()}
            className="action action-primary cursor-pointer !px-5 !py-2.5 !text-[0.9375rem] disabled:cursor-not-allowed disabled:bg-arena disabled:text-tinta-media disabled:hover:translate-y-0"
          >
            {copy.send}
          </button>
        </div>
        {showFooter && (
          <div className="mt-4 border-t border-regla pt-3 text-[0.75rem] leading-snug text-tinta-media">
            <p>{copy.footerPrices}</p>
            <p className="mt-0.5 text-tinta">{copy.footerClosing}</p>
          </div>
        )}
      </form>
    </div>
  );
}

function MessageRow({
  role,
  label,
  first = false,
  children,
}: {
  role: 'user' | 'assistant';
  label: string;
  first?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`chat-message relative py-4 ${first ? '' : 'border-t border-regla'} ${
        role === 'user'
          ? 'pl-4 before:absolute before:bottom-4 before:left-0 before:top-4 before:w-px before:bg-marca'
          : ''
      }`}
    >
      <p className="sr-only">{label}</p>
      <div
        className={`whitespace-pre-line text-[1rem] leading-relaxed ${
          role === 'user' ? 'text-tinta-media' : 'text-tinta'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
