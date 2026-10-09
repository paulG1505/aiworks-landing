'use client';

import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Conversation } from './Conversation';
import { CHAT_COPY } from './copy';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function ChatPanel({ isOpen, onClose }: Props) {
  const { locale } = useTranslation();
  const copy = CHAT_COPY[locale];
  const titleId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== 'Tab' || !rootRef.current) return;
    const items = Array.from(rootRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null,
    );
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || !rootRef.current.contains(active))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (active === last || !rootRef.current.contains(active))) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      hidden={!isOpen}
      onKeyDown={handleKeyDown}
      className="chat-panel fixed inset-0 z-[70] flex h-dvh flex-col bg-papel text-tinta lg:inset-auto lg:bottom-6 lg:right-6 lg:h-[min(41rem,calc(100dvh-3rem))] lg:w-[400px] lg:overflow-hidden lg:rounded-lg lg:border lg:border-[var(--regla-arena)]"
    >
      <header className="flex items-start justify-between gap-4 px-5 pb-4 pt-5">
        <div>
          <h2 id={titleId} className="text-[1.5rem] leading-none">
            {copy.title}
          </h2>
          <p className="eyebrow eyebrow-marker mt-2.5 !text-[0.6875rem]">{copy.label}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={copy.close}
          className="-mr-2 -mt-1 cursor-pointer rounded-full p-2 text-tinta-media transition-colors duration-150 hover:text-tinta"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </header>
      <div className="mx-5 border-t border-regla" />
      <Conversation tenant="aiworks" autoFocus={isOpen} />
    </div>
  );
}
