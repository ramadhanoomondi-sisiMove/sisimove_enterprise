import type { AdminFinancialTransaction } from '@/features/admin/finance/transactions/models';
import { TransactionEntryTableRow } from './TransactionEntryTableRow';

type TransactionEntry = AdminFinancialTransaction['entries'][number];

export interface TransactionEntryTableProps {
  entries: readonly TransactionEntry[];
  currency?: string | null;
}

export function TransactionEntryTable({
  entries,
  currency,
}: TransactionEntryTableProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--border)] px-4 py-8 text-center">
        <p className="text-sm font-medium text-[var(--foreground)]">No accounting entries</p>
        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          No ledger entries are available for this transaction.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
      <table className="w-full min-w-[680px] border-collapse text-left text-sm">
        <thead className="bg-[var(--background-subtle)] text-[var(--foreground-secondary)]">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">Entry</th>
            <th scope="col" className="px-4 py-3 font-medium">Account</th>
            <th scope="col" className="px-4 py-3 font-medium">Direction</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-subtle)]">
          {entries.map((entry, index) => (
            <TransactionEntryTableRow
              key={entry.publicId ?? `${index}`}
              entry={entry}
              currency={currency}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionEntryTable;
