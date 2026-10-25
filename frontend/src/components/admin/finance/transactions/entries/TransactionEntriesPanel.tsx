import type { AdminFinancialTransaction } from '@/features/admin/finance/transactions/models';
import { TransactionEntrySummary } from './TransactionEntrySummary';
import { TransactionEntryTable } from './TransactionEntryTable';

export interface TransactionEntriesPanelProps {
  transaction: AdminFinancialTransaction;
}

export function TransactionEntriesPanel({ transaction }: TransactionEntriesPanelProps) {
  const entries = Array.isArray(transaction.entries) ? transaction.entries : [];

  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Accounting entries
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Ledger entries associated with this transaction.
          </p>
        </div>
        <span className="rounded-full bg-[var(--background-subtle)] px-3 py-1 text-sm font-medium text-[var(--foreground-secondary)]">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      <div className="mt-5">
        <TransactionEntrySummary entries={entries} currency={transaction.currency} />
      </div>

      <div className="mt-5">
        <TransactionEntryTable entries={entries} currency={transaction.currency} />
      </div>
    </section>
  );
}

export default TransactionEntriesPanel;
