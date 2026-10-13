'use client';

import { useRef, type KeyboardEvent } from 'react';

const FIELD = 'input, select, textarea, [contenteditable="true"]';
const GO_WINDOW_MS = 1000;

interface Options {
  isDesktop: boolean;
  /** Opens the conversation in the reader (desktop only). */
  selectRow: (id: string) => void;
  focusSummary: () => void;
  onEscape?: (event: KeyboardEvent) => void;
}

export function useInboxKeyboard({ isDesktop, selectRow, focusSummary, onEscape }: Options) {
  const pressedG = useRef(0);

  return function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
    const target = event.target as HTMLElement;
    if (target.closest(FIELD)) return;

    if (event.key === 'Escape') {
      onEscape?.(event);
      return;
    }

    if (event.key === 'g') {
      pressedG.current = Date.now();
      return;
    }
    if (event.key === 'r') {
      if (Date.now() - pressedG.current < GO_WINDOW_MS) {
        pressedG.current = 0;
        event.preventDefault();
        focusSummary();
      }
      return;
    }

    const step = event.key === 'j' || event.key === 'ArrowDown' ? 1 : event.key === 'k' || event.key === 'ArrowUp' ? -1 : 0;
    if (step === 0) return;
    const from = target.closest<HTMLElement>('[data-inbox-list] [data-conversation-id]');
    if (!from) return;

    event.preventDefault();
    const rows = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[data-inbox-list] [data-conversation-id]'));
    const next = rows[rows.indexOf(from) + step];
    if (!next) return;
    next.focus();
    if (isDesktop) selectRow(next.dataset.conversationId as string);
  };
}
