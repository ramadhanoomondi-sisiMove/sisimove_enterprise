import type { AdminFinancialTransaction } from '@/features/admin/finance/transactions/models';
import { TransactionAmount } from '../shared/TransactionAmount';

type TransactionEntry = AdminFinancialTransaction['entries'][number];

export interface TransactionEntrySummaryProps {
  entries: readonly TransactionEntry[];
  currency?: string | null;
}

function numericValue(entry: TransactionEntry, keys: string[]): number | undefined {
  const source = entry as unknown as Record<string, unknown>;
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
  }
  return undefined;
}

export function TransactionEntrySummary({
  entries,
  currency,
}: TransactionEntrySummaryProps) {
  const debitTotal = entries.reduce(
    (sum, entry) => sum + (numericValue(entry, ['debitAmount', 'debit']) ?? 0),
    0,
  );
  const creditTotal = entries.reduce(
    (sum, entry) => sum + (numericValue(entry, ['creditAmount', 'credit']) ?? 0),
    0,
  );
  const hasDebitCredit = entries.some(
    (entry) =>
      numericValue(entry, ['debitAmount', 'debit']) !== undefined ||
      numericValue(entry, ['creditAmount', 'credit']) !== undefined,
  );

  if (!hasDebitCredit) {
    return (
      <p className="text-sm text-[var(--foreground-muted)]">
        Debit and credit totals are unavailable in the current entry data.
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-lg bg-[var(--background-subtle)] p-4">
        <p className="text-sm text-[var(--foreground-muted)]">Total debits</p>
        <p className="mt-1 text-lg font-semibold text-[var(--foreground)]">
          <TransactionAmount amount={debitTotal} currency={currency || 'KES'} />
        </p>
      </div>
      <div className="rounded-lg bg-[var(--background-subtle)] p-4">
        <p className="text-sm text-[var(--foreground-muted)]">Total credits</p>
        <p className="mt-1 text-lg font-semibold text-[var(--foreground)]">
          <TransactionAmount amount={creditTotal} currency={currency || 'KES'} />
        </p>
      </div>
    </div>
  );
}

export default TransactionEntrySummary;
