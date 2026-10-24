import { CalendarClock, Fingerprint, RefreshCw } from 'lucide-react';
import type { AdminFinancialAccountBalanceOnly } from '@/features/admin/finance/accounts/models';

export interface FinancialAccountBalanceMetadataProps {
  balance: AdminFinancialAccountBalanceOnly;
}

function dateLabel(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Unavailable'
    : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function MetadataItem({ icon: Icon, label, value }: {
  icon: typeof CalendarClock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-[var(--border)] p-3.5">
      <Icon size={16} className="mt-0.5 shrink-0 text-[var(--foreground-muted)]" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-xs font-medium text-[var(--foreground-muted)]">{label}</p>
        <p className="mt-1 break-words text-sm text-[var(--foreground)]">{value}</p>
      </div>
    </div>
  );
}

export function FinancialAccountBalanceMetadata({ balance }: FinancialAccountBalanceMetadataProps) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">Balance metadata</h3>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetadataItem icon={Fingerprint} label="Balance public ID" value={balance.publicId} />
        <MetadataItem icon={RefreshCw} label="Version" value={String(balance.version)} />
        <MetadataItem icon={CalendarClock} label="Created" value={dateLabel(balance.createdAt)} />
        <MetadataItem icon={CalendarClock} label="Last updated" value={dateLabel(balance.updatedAt)} />
      </div>
    </div>
  );
}

export default FinancialAccountBalanceMetadata;
