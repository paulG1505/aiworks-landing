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
import { CHAT_TEXTS } from './texts';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  action?: ChatAction | null;
}

interface Props {
  /** `aiworks` or `demo-<code>`: the tenant being written to. */
  tenant: string;
  welcome?: string;
  suggestions?: readonly string[];
  /** AIworks' own footer. The demo speaks as the business and hides it. */
  showFooter?: boolean;
  /** On network failure, offer AIworks' WhatsApp. The demo does not offer it inside the chat. */
  whatsappFallback?: boolean;
  /** Focuses the field on mount or when shown again. */
  autoFocus?: boolean;
}

/** Chat core shared by the floating panel (ChatPanel) and the demo page. */
export function Conversation({
  tenant,
  welcome,
  suggestions,
  showFooter = true,
  whatsappFallback = true,
  autoFocus = false,
}: Props) {
  const { locale } = useTranslation();
  const tx = CHAT_TEXTS[locale];
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const fieldId = useId();
  const counterId = useId();
  const list = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const nextId = useRef(1);
  const session = useRef<string | null>(null);
  const abort = useRef<AbortController | null>(null);

  const welcomeText = welcome ?? tx.welcome;
  const options = suggestions ?? tx.suggestions;
  const noMessagesYet = messages.length === 0;

  useEffect(() => {
    session.current = readSession(tenant);
    const controller = new AbortController();
    abort.current = controller;
    return () => controller.abort();
  }, [tenant]);

  useEffect(() => {
    if (autoFocus) field.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const el = list.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending]);

  // The field grows with its text up to 5 lines.
  useEffect(() => {
    const el = field.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
  }, [text]);

  const append = (message: Omit<Message, 'id'>) =>
    setMessages((previous) => [...previous, { ...message, id: nextId.current++ }]);

  const send = async (content: string) => {
    const message = content.trim();
    if (!message || sending || message.length > MAX_CHARS) return;
    append({ role: 'user', text: message });
    setText('');
    setSending(true);

    const result = await sendMessage(
      tenant,
      { sessionId: session.current, message, language: locale },
      abort.current?.signal,
    );
    if (abort.current?.signal.aborted) return;

    if (result.ok) {
      if (result.sessionId) {
        session.current = result.sessionId;
        saveSession(tenant, result.sessionId);
      }
      append({ role: 'assistant', text: result.reply, action: result.action });
    } else if (whatsappFallback) {
      append({
        role: 'assistant',
        text: tx.fallback,
        action: { type: 'whatsapp', url: whatsappLink(locale), code: null },
      });
    } else {
      append({ role: 'assistant', text: tx.fallbackNoWhatsapp });
    }
    setSending(false);
    field.current?.focus();
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(text);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
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
        <MessageRow role="assistant" label={tx.assistantRole} first>
          {welcomeText}
        </MessageRow>

        {noMessagesYet && (
          <div className="mt-5">
            <p className="eyebrow !text-[0.6875rem]">{tx.suggestionsTitle}</p>
            <ul className="mt-3">
              {options.map((option) => (
                <li key={option} className="border-t border-regla last:border-b">
                  <button
                    type="button"
                    onClick={() => void send(option)}
                    disabled={sending}
                    className="w-full cursor-pointer py-3 text-left text-[0.9375rem] leading-snug text-tinta transition-colors duration-150 hover:text-marca disabled:cursor-default"
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {messages.map((message) => (
          <MessageRow
            key={message.id}
            role={message.role}
            label={message.role === 'user' ? tx.userRole : tx.assistantRole}
          >
            {message.text}
            {message.action && (
              <div className="mt-4 flex flex-col items-start gap-2.5">
                <a
                  href={message.action.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${tx.continueOnWhatsapp} ${newTabNotice(locale)}`}
                  className="accion accion-primaria !px-5 !py-3 !text-[0.9375rem]"
                >
                  {tx.continueOnWhatsapp}
                </a>
                {message.action.code && (
                  <p className="text-[0.8125rem] text-tinta-media">
                    {tx.code}{' '}
                    <span className="tabular rounded-sm border border-regla px-1.5 py-0.5 text-[0.8125rem] font-medium text-tinta">
                      {message.action.code}
                    </span>
                  </p>
                )}
              </div>
            )}
          </MessageRow>
        ))}

        {sending && (
          <div className="chat-mensaje border-t border-regla py-4" role="status">
            <p className="eyebrow !text-[0.6875rem]">{tx.assistantRole}</p>
            <p className="mt-2 flex items-center gap-2 text-[0.875rem] text-tinta-media">
              <span className="flex gap-1" aria-hidden="true">
                <span className="escribiendo-punto" style={{ ['--d' as string]: '0ms' }} />
                <span className="escribiendo-punto" style={{ ['--d' as string]: '160ms' }} />
                <span className="escribiendo-punto" style={{ ['--d' as string]: '320ms' }} />
              </span>
              {tx.typing}
            </p>
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="border-t border-regla px-5 pb-4 pt-4">
        <label htmlFor={fieldId} className="sr-only">
          {tx.field}
        </label>
        <textarea
          id={fieldId}
          ref={field}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={tx.placeholder}
          aria-describedby={counterId}
          maxLength={MAX_CHARS}
          className="block max-h-[132px] w-full resize-none rounded-md border border-[var(--regla-arena)] bg-transparent px-3.5 py-3 text-[1rem] leading-snug text-tinta placeholder:text-tinta-media focus:border-marca focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca"
        />
        <div className="mt-3 flex items-center justify-between gap-4">
          <p
            id={counterId}
            aria-label={tx.characters(text.length, MAX_CHARS)}
            className={`tabular text-[0.75rem] ${nearLimit ? 'text-tinta' : 'text-tinta-media'}`}
          >
            {text.length}/{MAX_CHARS.toLocaleString('es-EC')}
          </p>
          <button
            type="submit"
            disabled={sending || !text.trim()}
            className="accion accion-primaria cursor-pointer !px-5 !py-2.5 !text-[0.9375rem] disabled:cursor-not-allowed disabled:bg-arena disabled:text-tinta-media disabled:hover:translate-y-0"
          >
            {tx.send}
          </button>
        </div>
        {showFooter && (
          <div className="mt-4 border-t border-regla pt-3 text-[0.75rem] leading-snug text-tinta-media">
            <p>{tx.footerPrices}</p>
            <p className="mt-0.5 text-tinta">{tx.footerClosing}</p>
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
      className={`chat-mensaje relative py-4 ${first ? '' : 'border-t border-regla'} ${
        role === 'user'
          ? 'pl-4 before:absolute before:bottom-4 before:left-0 before:top-4 before:w-px before:bg-marca'
          : ''
      }`}
    >
      {/* The visitor's rule marks who is speaking; the label is for screen readers only. */}
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
