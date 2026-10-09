'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, m } from 'motion/react';
import { X } from 'lucide-react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { whatsappLink, newTabNotice } from '@/shared/lib/whatsapp';
import { LogoWhatsApp } from './LogoWhatsApp';

const BUBBLE_DELAY_MS = 8000;
const BUBBLE_SCROLL_RATIO = 0.4;
const DISMISSED_KEY = 'aiworks-burbuja-whatsapp';

// Sits above the chat launcher (ChatLauncher), which is the primary button. The logo is dark
// green rather than white for contrast: white on #25D366 is 1.98:1, #0B3D1F is 6.2:1.
export function FloatingWhatsApp() {
  const { t, locale } = useTranslation();
  const pathname = usePathname();
  const [bubbleVisible, setBubbleVisible] = useState(false);
  // Read on mount; the bubble starts hidden, so server and client HTML match.
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return !!sessionStorage.getItem(DISMISSED_KEY);
    } catch {
      return false;
    }
  });
  const [inContactSection, setInContactSection] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setBubbleVisible(true), BUBBLE_DELAY_MS);
    let frame = 0;
    const measure = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0 && window.scrollY / scrollable >= BUBBLE_SCROLL_RATIO) setBubbleVisible(true);
      const contact = document.getElementById('contacto');
      setInContactSection(!!contact && contact.getBoundingClientRect().top < window.innerHeight * 0.85);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISSED_KEY, '1');
    } catch {
      // Without storage the dismissal lasts until reload.
    }
  };

  // The demo page has its own call to action and its own chat.
  if (pathname?.startsWith('/demo')) return null;

  const href = whatsappLink(locale);
  const label = `${t.header.cta} ${newTabNotice(locale)}`;

  return (
    <div
      className={`fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom,0px))] right-5 z-40 flex items-end gap-3 transition-opacity duration-200 lg:bottom-[6.75rem] lg:right-8 ${
        inContactSection ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      aria-hidden={inContactSection || undefined}
    >
      <AnimatePresence>
        {bubbleVisible && !dismissed && (
          <m.div
            key="bubble"
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96, transition: { duration: 0.18 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            style={{ transformOrigin: 'bottom right' }}
            className="relative flex max-w-[calc(100vw-7rem)] items-start gap-3 rounded-2xl border border-regla bg-papel py-3.5 pl-4 pr-10 text-tinta shadow-[0_18px_40px_-20px_rgb(0_0_0/0.45)]"
          >
            <span
              className="mt-1.5 size-2.5 shrink-0 rounded-full bg-[#25D366] shadow-[0_0_0_3px_rgb(37_211_102/0.25)]"
              aria-hidden="true"
            />
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex flex-col"
            >
              <span className="font-semibold leading-snug">{t.whatsappFlotante.titulo}</span>
              <span className="text-[0.9375rem] leading-snug text-tinta-media">
                {t.whatsappFlotante.texto}
              </span>
            </a>
            <button
              type="button"
              onClick={dismiss}
              aria-label={t.whatsappFlotante.cerrar}
              className="absolute right-2 top-2 cursor-pointer rounded-full p-1.5 text-tinta-media transition-colors duration-150 hover:bg-arena hover:text-tinta"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </m.div>
        )}
      </AnimatePresence>

      <m.a
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={inContactSection ? -1 : undefined}
        className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#128C4A] bg-[#25D366] text-[#0B3D1F] shadow-[0_12px_28px_-12px_rgb(0_0_0/0.45)] hover:bg-[#20BD5A]"
        aria-label={label}
      >
        <LogoWhatsApp className="size-6" />
      </m.a>
    </div>
  );
}
