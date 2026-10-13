'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useUIStore } from '@/shared/store/useUIStore';

const ChatPanel = dynamic(() => import('./ChatPanel'), { ssr: false });

const LABEL = { es: 'Pregúntenos', en: 'Ask us' } as const;
const ARIA_LABEL = {
  es: 'Abrir el chat con el asistente de AIworks',
  en: 'Open the chat with the AIworks assistant',
} as const;

export function ChatLauncher() {
  const { locale } = useTranslation();
  const pathname = usePathname();
  const isOpen = useUIStore((s) => s.isChatOpen);
  const openChat = useUIStore((s) => s.openChat);
  const closeChat = useUIStore((s) => s.closeChat);
  const [loaded, setLoaded] = useState(false);
  if (isOpen && !loaded) setLoaded(true);
  const chatOpener = useUIStore((s) => s.chatOpener);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (wasOpen.current && !isOpen) {
      const isValid = chatOpener && chatOpener !== document.body && document.contains(chatOpener);
      const target = isValid ? chatOpener : buttonRef.current;
      target?.focus();
    }
    wasOpen.current = isOpen;
  }, [isOpen, chatOpener]);

  const [ctaVisible, setCtaVisible] = useState(false);
  useEffect(() => {
    const cta = document.getElementById('assistant-cta');
    if (!cta || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setCtaVisible(e.isIntersecting), { threshold: 0.1 });
    io.observe(cta);
    return () => io.disconnect();
  }, [pathname]);

  if (pathname?.startsWith('/demo')) return null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={openChat}
        aria-label={ARIA_LABEL[locale]}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`action action-primary fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] right-5 z-40 cursor-pointer !px-6 !py-4 lg:bottom-8 lg:right-8 ${
          isOpen || ctaVisible ? 'invisible' : ''
        }`}
        aria-hidden={ctaVisible && !isOpen ? true : undefined}
        tabIndex={ctaVisible && !isOpen ? -1 : undefined}
      >
        {LABEL[locale]}
      </button>
      {loaded && <ChatPanel isOpen={isOpen} onClose={closeChat} />}
    </>
  );
}
