'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { whatsappLink } from '@/shared/lib/whatsapp';
import type { Locale } from '@/shared/lib/i18n/translations';
import { sendMessage, saveSession, readSession, MAX_CHARS, type ChatAction } from './api';
import { CHAT_COPY } from './copy';
import { resolveChatOutcome } from './chatOutcome';
import type { EndedKind } from './endedReply';

export interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  action?: ChatAction | null;
  failed?: boolean;
  retryText?: string;
}

export interface EndedState {
  kind: EndedKind;
  text: string;
}

interface Options {
  tenant: string;
  locale: Locale;
  whatsappFallback: boolean;
  isDemo: boolean;
  maxChars?: number;
}

export function useConversation({ tenant, locale, whatsappFallback, isDemo, maxChars = MAX_CHARS }: Options) {
  const copy = CHAT_COPY[locale];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [ended, setEnded] = useState<EndedState | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [activeTenant, setActiveTenant] = useState(tenant);
  const nextId = useRef(1);
  const session = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const inFlight = useRef(false);

  if (activeTenant !== tenant) {
    setActiveTenant(tenant);
    setMessages([]);
    setEnded(null);
    setSending(false);
    setRemaining(null);
    setUserMessageCount(0);
  }

  useEffect(() => {
    session.current = readSession(tenant);
    const controller = new AbortController();
    abortRef.current = controller;
    return () => controller.abort();
  }, [tenant]);

  const addMessage = useCallback((m: Omit<ChatMessage, 'id'>) => {
    setMessages((previous) => [...previous, { ...m, id: nextId.current++ }]);
  }, []);

  const deliver = useCallback(
    async (message: string): Promise<boolean> => {
      if (inFlight.current) return false;
      inFlight.current = true;
      const signal = abortRef.current?.signal;
      setSending(true);
      try {
        const result = await sendMessage(
          tenant,
          { sessionId: session.current, message, language: locale },
          signal,
        );
        if (signal?.aborted) return false;

        if (result.ok && result.sessionId) {
          session.current = result.sessionId;
          saveSession(tenant, result.sessionId);
        }
        const outcome = resolveChatOutcome(result, isDemo);
        if (outcome.type === 'ended') {
          setEnded({ kind: outcome.kind, text: outcome.text ?? copy.ended[outcome.kind] });
        } else if (outcome.type === 'reply') {
          addMessage({ role: 'assistant', text: outcome.text, action: outcome.action });
          setRemaining(outcome.remaining);
          if (outcome.endsAfter) setEnded({ kind: 'limit', text: copy.ended.limit });
        } else if (whatsappFallback) {
          addMessage({
            role: 'assistant',
            text: copy.fallback,
            action: { kind: 'whatsapp', url: whatsappLink(locale), code: null },
          });
        } else {
          addMessage({ role: 'assistant', text: copy.fallbackNoWhatsapp, failed: true, retryText: message });
        }
        setSending(false);
        return true;
      } finally {
        inFlight.current = false;
      }
    },
    [tenant, locale, isDemo, whatsappFallback, copy, addMessage],
  );

  const send = useCallback(
    async (content: string): Promise<boolean> => {
      const message = content.trim();
      if (!message || inFlight.current || ended || message.length > maxChars) return false;
      setMessages((previous) => previous.filter((m) => !m.failed));
      addMessage({ role: 'user', text: message });
      setUserMessageCount((n) => n + 1);
      return deliver(message);
    },
    [ended, maxChars, addMessage, deliver],
  );

  const retry = useCallback(
    async (text: string): Promise<boolean> => {
      if (inFlight.current || ended || !text) return false;
      setMessages((previous) => previous.filter((m) => !m.failed));
      return deliver(text);
    },
    [ended, deliver],
  );

  return { messages, sending, ended, remaining, userMessageCount, send, retry };
}
