
import { Badge } from '@/components/ui/badge';
import { cn } from '@/foundation/utils/cn';

import {
  AdminFinancialTransactionStatus,
  type AdminFinancialTransactionMetrics,
} from '@/features/admin/finance/transactions';

export interface TransactionStatusSummaryProps {
  metrics: AdminFinancialTransactionMetrics;
  className?: string;
}

const statusConfig = [
  {
    status: AdminFinancialTransactionStatus.PENDING,
    label: 'Pending',
    variant: 'warning',
    description: 'Awaiting completion',
    barClass: 'bg-[var(--warning)]',
  },
  {
    status: AdminFinancialTransactionStatus.COMPLETED,
    label: 'Completed',
    variant: 'success',
    description: 'Successfully completed',
    barClass: 'bg-[var(--success)]',
  },
  {
    status: AdminFinancialTransactionStatus.FAILED,
    label: 'Failed',
    variant: 'danger',
    description: 'Unsuccessful transactions',
    barClass: 'bg-[var(--danger)]',
  },
  {
    status: AdminFinancialTransactionStatus.REVERSED,
    label: 'Reversed',
    variant: 'outline',
    description: 'Transactions reversed',
    barClass: 'bg-[var(--foreground-muted)]',
  },
  {
    status: AdminFinancialTransactionStatus.CANCELLED,
    label: 'Cancelled',
    variant: 'default',
    description: 'Transactions cancelled',
    barClass: 'bg-[var(--foreground-subtle)]',
  },
] as const;

export function TransactionStatusSummary({
  metrics,
  className,
}: TransactionStatusSummaryProps) {
  const counts = new Map(
    metrics.statusBreakdown.map((item) => [item.status, item.count]),
  );

  const rows = statusConfig.map((item) => ({
    ...item,
    count: counts.get(item.status) ?? 0,
  }));

  const total = rows.reduce((sum, item) => sum + item.count, 0);

  return (
    <section
      aria-labelledby="transaction-status-summary-title"
      className={cn(
        'rounded-[var(--radius-xl)] border border-[var(--border)]',
        'bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)] sm:p-5',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2
            id="transaction-status-summary-title"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Transaction status
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Breakdown by lifecycle status
          </p>
        </div>

        <span className="text-sm font-semibold tabular-nums text-[var(--foreground-secondary)]">
          {new Intl.NumberFormat('en-KE').format(total)}
        </span>
      </div>

      <div className="mt-5 space-y-5">
        {rows.map((item) => {
          const percentage =
            total > 0 ? (item.count / total) * 100 : 0;

          return (
            <div key={item.status}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'h-2 w-2 shrink-0 rounded-full',
                      item.barClass,
                    )}
                  />
                  <span className="truncate text-sm font-medium text-[var(--foreground)]">
                    {item.label}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm font-semibold tabular-nums text-[var(--foreground)]">
                    {new Intl.NumberFormat('en-KE').format(item.count)}
                  </span>
                  <Badge variant={item.variant} size="sm">
                    {percentage.toFixed(1)}%
                  </Badge>
                </div>
              </div>

              <div
                className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--background-muted)]"
                role="progressbar"
                aria-label={`${item.label} share`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Number(percentage.toFixed(1))}
              >
                <div
                  className={cn(
                    'h-full rounded-full transition-[width] duration-300',
                    item.barClass,
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default TransactionStatusSummary;
