
import { ArrowUpRight, Coins } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

import { formatTransactionAmount } from '../shared/TransactionAmount';
import type { AdminFinancialTransactionMetrics } from '@/features/admin/finance/transactions';

export interface TransactionVolumeSummaryProps {
  metrics: AdminFinancialTransactionMetrics;
  className?: string;
}

export function TransactionVolumeSummary({
  metrics,
  className,
}: TransactionVolumeSummaryProps) {
  const volumes = metrics.volumeByCurrency;

  const transactionCount = volumes.reduce(
    (total, item) => total + item.transactionCount,
    0,
  );

  return (
    <section
      aria-labelledby="transaction-volume-summary-title"
      className={cn(
        'rounded-[var(--radius-xl)] border border-[var(--border)]',
        'bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)] sm:p-5',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2
            id="transaction-volume-summary-title"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Transaction volume
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Amounts grouped by currency
          </p>
        </div>

        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-soft)] text-[var(--brand)]"
        >
          <Coins className="h-5 w-5" />
        </span>
      </div>

      {volumes.length === 0 ? (
        <div className="mt-5 rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] px-4 py-8 text-center">
          <p className="text-sm font-medium text-[var(--foreground-secondary)]">
            No volume data available
          </p>
          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            Currency totals will appear when transaction metrics are available.
          </p>
        </div>
      ) : (
        <div className="mt-5 divide-y divide-[var(--border-subtle)]">
          {volumes.map((item) => (
            <div
              key={item.currency}
              className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--background-muted)] text-xs font-bold text-[var(--foreground-secondary)]">
                  {item.currency.toUpperCase()}
                </span>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {item.currency.toUpperCase()}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
                    {new Intl.NumberFormat('en-KE').format(
                      item.transactionCount,
                    )}{' '}
                    {item.transactionCount === 1
                      ? 'transaction'
                      : 'transactions'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 sm:justify-end">
                <span className="text-base font-semibold tabular-nums text-[var(--foreground)]">
                  {formatTransactionAmount(item.amount, item.currency)}
                </span>

                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-[var(--foreground-subtle)]"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-4">
        <span className="text-xs text-[var(--foreground-muted)]">
          Transactions represented
        </span>
        <span className="text-sm font-semibold tabular-nums text-[var(--foreground)]">
          {new Intl.NumberFormat('en-KE').format(transactionCount)}
        </span>
      </div>
    </section>
  );
}

export default TransactionVolumeSummary;
