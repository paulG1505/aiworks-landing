import { copy } from '../copy';
import { formatDateTime, safeContact } from '../lib/format';
import type { ConversationSummary } from '../types';

interface InboxRowProps {
  item: ConversationSummary;
  tenantName: string;
  selected: boolean;
  buttonRef: (element: HTMLButtonElement | null) => void;
  onSelect: (id: string) => void;
}

export function InboxRow({ item, tenantName, selected, buttonRef, onSelect }: InboxRowProps) {
  return (
    <li className="border-b border-regla">
      <button
        ref={buttonRef}
        type="button"
        data-conversation-id={item.id}
        aria-current={selected ? 'true' : undefined}
        onClick={() => onSelect(item.id)}
        className={`flex w-full cursor-pointer items-start justify-between gap-4 border-l-2 px-4 py-3 text-left lg:px-6 ${
          selected ? 'border-marca bg-arena' : 'border-transparent'
        }`}
      >
        <span className="flex min-w-0 flex-col gap-1">
          <span className="tabular text-xs text-tinta-media">
            {formatDateTime(item.createdAt)} · {tenantName} · {item.channel === 'web' ? 'WEB' : 'WHATSAPP'}
          </span>
          <span className="break-words">{safeContact(item.contact)}</span>
        </span>
        <span className="tabular flex shrink-0 flex-col items-end gap-1 text-xs text-tinta-media">
          <span>{copy.inbox.turns(item.turns)}</span>
          <span aria-label={copy.inbox.signals(item.signalsReached, item.signalsTotal)}>
            {item.signalsReached}/{item.signalsTotal}
          </span>
          {item.readyForCall && <span className="text-marca">{copy.inbox.ready}</span>}
        </span>
      </button>
    </li>
  );
}
