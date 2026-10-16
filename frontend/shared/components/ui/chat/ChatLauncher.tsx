'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useUIStore } from '@/shared/store/useUIStore';
import { LauncherCloud } from './LauncherCloud';
import { RobotIcon } from './RobotIcon';
import { LAUNCHER_COPY } from './launcherCopy';
import {
  MOBILE_QUERY,
  getSessionStorage,
  isLauncherHidden,
  isLauncherRoute,
  planCloud,
  readCloudDismissed,
  writeCloudDismissed,
  type CtaPosition,
} from './launcherState';

const ChatPanel = dynamic(() => import('./ChatPanel'), { ssr: false });

export function ChatLauncher() {
  const { locale } = useTranslation();
  const copy = LAUNCHER_COPY[locale];
  const pathname = usePathname();
  const isOpen = useUIStore((s) => s.isChatOpen);
  const openChat = useUIStore((s) => s.openChat);
  const closeChat = useUIStore((s) => s.closeChat);
  const [loaded, setLoaded] = useState(false);
  if (isOpen && !loaded) setLoaded(true);
  const chatOpener = useUIStore((s) => s.chatOpener);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const [cloudVisible, setCloudVisible] = useState(false);
  if (isOpen && cloudVisible) setCloudVisible(false);

  useEffect(() => {
    if (wasOpen.current && !isOpen) {
      const isValid = chatOpener && chatOpener !== document.body && document.contains(chatOpener);
      const target = isValid ? chatOpener : buttonRef.current;
      target?.focus();
    }
    wasOpen.current = isOpen;
  }, [isOpen, chatOpener]);

  useEffect(() => {
    if (isOpen) writeCloudDismissed(getSessionStorage());
  }, [isOpen]);

  const [ctaReport, setCtaReport] = useState<{ path: string | null; position: CtaPosition }>({
    path: null,
    position: 'unknown',
  });
  const ctaPosition = ctaReport.path === pathname ? ctaReport.position : 'unknown';
  useEffect(() => {
    const report = (position: CtaPosition) => setCtaReport({ path: pathname, position });
    const cta = document.getElementById('assistant-cta');
    if (!cta || typeof IntersectionObserver === 'undefined') {
      const frame = requestAnimationFrame(() => report('off-screen'));
      return () => cancelAnimationFrame(frame);
    }
    const io = new IntersectionObserver(([e]) => report(e.isIntersecting ? 'on-screen' : 'off-screen'), { threshold: 0.1 });
    io.observe(cta);
    return () => io.disconnect();
  }, [pathname]);

  const routeEnabled = isLauncherRoute(pathname);
  const hidden = isLauncherHidden({ isOpen, ctaPosition });
  if (hidden && cloudVisible) setCloudVisible(false);
  useEffect(() => {
    if (!routeEnabled || hidden) return;
    const plan = planCloud({ dismissed: readCloudDismissed(getSessionStorage()), isMobile });
    if (!plan) return;
    const timers = [setTimeout(() => setCloudVisible(true), plan.showAfterMs)];
    if (plan.autoHideAfterMs !== null) {
      timers.push(
        setTimeout(() => {
          writeCloudDismissed(getSessionStorage());
          setCloudVisible(false);
        }, plan.showAfterMs + plan.autoHideAfterMs)
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [routeEnabled, hidden, isMobile]);

  if (!routeEnabled) return null;

  const dismissCloud = () => {
    writeCloudDismissed(getSessionStorage());
    setCloudVisible(false);
    buttonRef.current?.focus();
  };

  return (
    <>
      <div
        className={`fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] right-5 z-40 flex items-end gap-2 lg:bottom-8 lg:right-8 ${
          hidden ? 'invisible' : ''
        }`}
        aria-hidden={ctaPosition !== 'off-screen' && !isOpen ? true : undefined}
      >
        {cloudVisible && !hidden && (
          <LauncherCloud copy={copy} onOpen={openChat} onDismiss={dismissCloud} />
        )}
        <button
          ref={buttonRef}
          type="button"
          onClick={openChat}
          aria-label={copy.openChat}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          tabIndex={ctaPosition !== 'off-screen' && !isOpen ? -1 : undefined}
          className="relative flex h-[52px] w-[52px] shrink-0 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-marca bg-papel text-marca"
        >
          <RobotIcon className="h-7 w-7" />
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 h-[11px] w-[11px] rounded-full border-2 border-papel bg-marca"
          />
        </button>
      </div>
      {loaded && <ChatPanel isOpen={isOpen} onClose={closeChat} />}
    </>
  );
}
