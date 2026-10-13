'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useConsoleParams } from '../hooks/useConsoleParams';
import { useInboxKeyboard } from '../hooks/useInboxKeyboard';
import { useIsDesktop } from '../hooks/useIsDesktop';
import type { SessionInfo } from '../types';
import { ConsoleHeader } from './ConsoleHeader';
import { ConversationReader } from './ConversationReader';
import { Inbox, type InboxHandle } from './Inbox';
import { MonthSummary } from './MonthSummary';

interface ConsoleScreenProps {
  session: SessionInfo;
  onSignOut: () => void;
}

export function ConsoleScreen({ session, onSignOut }: ConsoleScreenProps) {
  const { params, update } = useConsoleParams(session.tenants.map((tenant) => tenant.id));
  const isDesktop = useIsDesktop();
  const summaryHeading = useRef<HTMLHeadingElement>(null);
  const readerHeading = useRef<HTMLHeadingElement>(null);
  const inbox = useRef<InboxHandle>(null);
  const focusReader = useRef(false);
  const [restoreFocusId, setRestoreFocusId] = useState<string | undefined>();
  const clearRestore = useCallback(() => setRestoreFocusId(undefined), []);

  const { conversationId } = params;
  const readerOnly = !isDesktop && conversationId !== undefined;

  useEffect(() => {
    if (!focusReader.current || !conversationId) return;
    focusReader.current = false;
    readerHeading.current?.focus();
  }, [conversationId]);

  const openRow = (id: string) => {
    if (id === conversationId) {
      readerHeading.current?.focus();
      return;
    }
    focusReader.current = true;
    update({ conversationId: id });
  };

  const closeReader = () => {
    setRestoreFocusId(conversationId);
    update({ conversationId: undefined });
  };

  const onEscape = (event: KeyboardEvent) => {
    if (!isDesktop) {
      if (conversationId) closeReader();
      return;
    }
    if ((event.target as HTMLElement).closest('[data-reader]') && conversationId) {
      inbox.current?.focusRow(conversationId);
    }
  };

  const onKeyDown = useInboxKeyboard({
    isDesktop,
    selectRow: (id) => update({ conversationId: id }),
    focusSummary: () => summaryHeading.current?.focus(),
    onEscape,
  });

  const reader = (
    <ConversationReader
      id={conversationId}
      tenants={session.tenants}
      headingRef={readerHeading}
      onBack={readerOnly ? closeReader : undefined}
    />
  );

  return (
    <div onKeyDown={onKeyDown} className={`flex flex-col bg-papel text-tinta ${isDesktop ? 'h-dvh' : 'min-h-dvh'}`}>
      <ConsoleHeader user={session.user} onSignOut={onSignOut} />
      {readerOnly ? (
        reader
      ) : (
        <>
          <MonthSummary
            month={params.month}
            tenantId={params.tenantId}
            channel={params.channel}
            tenants={session.tenants}
            headingRef={summaryHeading}
            onMonthChange={(month) => update({ month })}
          />
          <div className={isDesktop ? 'flex min-h-0 flex-1' : 'flex flex-1 flex-col'}>
            <Inbox
              ref={inbox}
              month={params.month}
              tenantId={params.tenantId}
              channel={params.channel}
              readyOnly={params.readyOnly}
              tenants={session.tenants}
              selectedId={conversationId}
              onSelect={openRow}
              onFiltersChange={(patch) => update(patch)}
              restoreFocusId={restoreFocusId}
              onFocusRestored={clearRestore}
            />
            {isDesktop && reader}
          </div>
        </>
      )}
    </div>
  );
}
