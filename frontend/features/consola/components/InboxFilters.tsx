import { copy } from '../copy';
import type { Channel, Tenant } from '../types';

interface InboxFiltersProps {
  tenants: Tenant[];
  tenantId?: string;
  channel?: Channel;
  readyOnly: boolean;
  onChange: (patch: { tenantId?: string; channel?: Channel; readyOnly?: boolean }) => void;
}

export function InboxFilters({ tenants, tenantId, channel, readyOnly, onChange }: InboxFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-x-6 gap-y-3 border-b border-regla px-4 py-3 lg:px-6">
      <label className="flex min-w-0 flex-col gap-1">
        <span className="eyebrow">{copy.inbox.tenant}</span>
        <select
          className="console-field"
          value={tenantId ?? ''}
          onChange={(event) => onChange({ tenantId: event.target.value || undefined })}
        >
          <option value="">{copy.inbox.all}</option>
          {tenants.map((tenant) => (
            <option key={tenant.id} value={tenant.id}>
              {tenant.name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex min-w-0 flex-col gap-1">
        <span className="eyebrow">{copy.inbox.channel}</span>
        <select
          className="console-field"
          value={channel ?? ''}
          onChange={(event) => onChange({ channel: (event.target.value || undefined) as Channel | undefined })}
        >
          <option value="">{copy.inbox.all}</option>
          <option value="web">{copy.channel.web}</option>
          <option value="whatsapp">{copy.channel.whatsapp}</option>
        </select>
      </label>
      <label className="flex items-center gap-2 pb-2 text-sm">
        <input
          type="checkbox"
          className="size-4 accent-[var(--marca)]"
          checked={readyOnly}
          onChange={(event) => onChange({ readyOnly: event.target.checked })}
        />
        {copy.inbox.readyOnly}
      </label>
    </div>
  );
}
