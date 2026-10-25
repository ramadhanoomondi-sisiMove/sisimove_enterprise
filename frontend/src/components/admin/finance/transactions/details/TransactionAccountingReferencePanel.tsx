import type { AdminFinancialTransaction } from '@/features/admin/finance/transactions/models';

export interface TransactionAccountingReferencePanelProps {
  transaction: AdminFinancialTransaction;
}

export function TransactionAccountingReferencePanel({ transaction }: TransactionAccountingReferencePanelProps) {
  const journalPublicId = transaction.accountingJournalPublicId;

  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <h2 className="text-base font-semibold text-[var(--foreground)]">Accounting references</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="min-w-0">
          <dt className="text-sm text-[var(--foreground-muted)]">Accounting journal public ID</dt>
          <dd className="mt-1 break-all font-mono text-sm text-[var(--foreground)]">
            {journalPublicId || 'No journal linked'}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-[var(--foreground-muted)]">Accounting entries</dt>
          <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">
            {Array.isArray(transaction.entries) ? transaction.entries.length : 0}
          </dd>
        </div>
      </dl>
    </section>
  );
}
