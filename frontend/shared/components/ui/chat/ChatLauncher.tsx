'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';

// Separate chunk: not downloaded until the first click.
const ChatPanel = dynamic(() => import('./ChatPanel'), { ssr: false });

// These strings live here rather than in texts.ts because the launcher ships in the first load.
const LABEL = { es: 'Pregúntenos', en: 'Ask us' } as const;
const ARIA = {
  es: 'Abrir el chat con el asistente de AIworks',
  en: 'Open the chat with the AIworks assistant',
} as const;

// Hidden on the demo page, where the chat is already part of the page.
export function ChatLauncher() {
  const { locale } = useTranslation();
  const pathname = usePathname();
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  // On close, focus returns to the button that opened the panel.
  useEffect(() => {
    if (wasOpen.current && !open) button.current?.focus();
    wasOpen.current = open;
  }, [open]);

  if (pathname?.startsWith('/demo')) return null;

  return (
    <>
      <button
        ref={button}
        type="button"
        onClick={() => {
          setLoaded(true);
          setOpen(true);
        }}
        aria-label={ARIA[locale]}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`accion accion-primaria fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] right-5 z-40 cursor-pointer !px-6 !py-4 lg:bottom-8 lg:right-8 ${
          open ? 'invisible' : ''
        }`}
      >
        {LABEL[locale]}
      </button>
      {loaded && <ChatPanel open={open} onClose={() => setOpen(false)} />}
    </>
  );
}
