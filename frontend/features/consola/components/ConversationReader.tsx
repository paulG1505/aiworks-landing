'use client';

import { useCallback, type RefObject } from 'react';
import { useConsoleApi } from '../api/ConsoleApiContext';
import { copy } from '../copy';
import { useApiResource } from '../hooks/useApiResource';
import { formatTime, safeContact } from '../lib/format';
import type { ConversationDetail, Tenant } from '../types';
import { SignalList } from './SignalList';
import { ZoneStatus } from './ZoneStatus';

interface ConversationReaderProps {
  id: string | undefined;
  tenants: Tenant[];
  headingRef: RefObject<HTMLHeadingElement | null>;
  onBack?: () => void;
}

export function ConversationReader({ id, tenants, headingRef, onBack }: ConversationReaderProps) {
  return (
    <section
      aria-label={copy.reader.label}
      tabIndex={0}
      data-reader=""
      className="min-h-0 flex-1 overflow-y-auto px-4 py-4 lg:px-8 lg:py-6"
    >
      {onBack && (
        <button type="button" onClick={onBack} className="link mb-4 cursor-pointer text-sm">
          {copy.reader.back}
        </button>
      )}
      {id ? (
        <LoadedReader key={id} id={id} tenants={tenants} headingRef={headingRef} />
      ) : (
        <p className="text-tinta-media">{copy.reader.empty}</p>
      )}
    </section>
  );
}

function LoadedReader({ id, tenants, headingRef }: { id: string; tenants: Tenant[]; headingRef: ConversationReaderProps['headingRef'] }) {
  const api = useConsoleApi();
  const fetcher = useCallback((signal: AbortSignal) => api.getConversation(id, signal), [api, id]);
  const { state, reload } = useApiResource(fetcher);
  const detail = state.status === 'ready' ? state.data : null;

  // One heading element for every state, so a focus placed on it survives the load.
  return (
    <div aria-busy={state.status === 'loading'}>
      <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl break-words">
        {detail ? safeContact(detail.contact) : copy.reader.label}
      </h2>
      {state.status === 'loading' && (
        <div className="mt-4">
          <ZoneStatus kind="loading" lines={5} />
        </div>
      )}
      {state.status === 'error' && (
        <div className="mt-4">
          {state.error.kind === 'not_found' ? (
            <ZoneStatus kind="message" message={copy.zone.notFound} />
          ) : (
            <ZoneStatus kind="error" error={state.error} onRetry={reload} />
          )}
        </div>
      )}
      {detail && <Body detail={detail} tenants={tenants} />}
    </div>
  );
}

function Body({ detail, tenants }: { detail: ConversationDetail; tenants: Tenant[] }) {
  const tenantName = tenants.find((tenant) => tenant.id === detail.tenantId)?.name ?? detail.tenantId;
  const language = detail.language ? copy.reader.language[detail.language] : copy.reader.language.none;
  return (
    <div className="console-fade">
      <p className="tabular mt-2 text-xs text-tinta-media">
        {tenantName} · {detail.channel === 'web' ? 'WEB' : 'WHATSAPP'} · {language} · {copy.inbox.turns(detail.turns)}
      </p>
      <ol className="mt-6 flex flex-col gap-5">
        {detail.messages.map((message, index) => (
          <li
            key={index}
            className={`border-l-2 pl-4 ${message.speaker === 'assistant' ? 'border-marca' : 'border-transparent'}`}
          >
            <p className="tabular text-xs text-tinta-media">
              {message.speaker === 'assistant' ? copy.reader.assistant : copy.reader.visitor} · {formatTime(message.at)}
            </p>
            <p className="mt-1 whitespace-pre-wrap [overflow-wrap:anywhere]">{message.text}</p>
          </li>
        ))}
      </ol>
      <SignalList signals={detail.signals} />
    </div>
  );
}
