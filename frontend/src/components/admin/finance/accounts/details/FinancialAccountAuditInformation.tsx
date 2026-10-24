import { CalendarClock, History } from 'lucide-react';
import type { AdminFinancialAccount } from '@/features/admin/finance/accounts/models';

export interface FinancialAccountAuditInformationProps {
  account: AdminFinancialAccount;
  /** Optional separately verified balance response timestamp; not an event history. */
  balanceUpdatedAt?: string;
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unavailable';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function AuditField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">{label}</p>
      <p className="mt-2 text-sm font-medium text-[var(--foreground)]">{value}</p>
    </div>
  );
}

export function FinancialAccountAuditInformation({ account, balanceUpdatedAt }: FinancialAccountAuditInformationProps) {
  return (
    <section aria-labelledby="financial-account-audit-title" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--background-muted)] text-[var(--foreground-secondary)]">
          <History size={20} aria-hidden="true" />
        </span>
        <div>
          <h2 id="financial-account-audit-title" className="font-semibold text-[var(--foreground)]">Audit information</h2>
          <p className="text-sm text-[var(--foreground-secondary)]">Record timestamps available from the account and balance responses</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <AuditField label="Account created" value={formatDateTime(account.createdAt)} />
        <AuditField label="Account last updated" value={formatDateTime(account.updatedAt)} />
        <AuditField label="Balance created" value={formatDateTime(account.balance.createdAt)} />
        <AuditField label="Balance last updated" value={formatDateTime(balanceUpdatedAt ?? account.balance.updatedAt)} />
      </div>
      <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-[var(--foreground-muted)]">
        <CalendarClock size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
        These are record timestamps, not a transaction or state-change audit trail. No event history is shown because it is not part of the supplied account response contract.
      </p>
    </section>
  );
}

export default FinancialAccountAuditInformation;
