import type { AdminFinancialTransaction } from '@/features/admin/finance/transactions/models';

export interface TransactionAccountReferencesPanelProps {
  transaction: AdminFinancialTransaction;
}

function AccountReference({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="min-w-0">
      <dt className="text-sm text-[var(--foreground-muted)]">{label}</dt>
      <dd className="mt-1 break-all font-mono text-sm text-[var(--foreground)]">{value || 'Not specified'}</dd>
    </div>
  );
}

export function TransactionAccountReferencesPanel({ transaction }: TransactionAccountReferencesPanelProps) {
  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <h2 className="text-base font-semibold text-[var(--foreground)]">Account references</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <AccountReference label="Source account public ID" value={transaction.sourceAccountPublicId} />
        <AccountReference label="Destination account public ID" value={transaction.destinationAccountPublicId} />
      </dl>
    </section>
  );
}
