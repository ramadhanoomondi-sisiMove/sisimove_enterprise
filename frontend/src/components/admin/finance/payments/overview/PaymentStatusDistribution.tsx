// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Payment Status Distribution
// -----------------------------------------------------------------------------

import type { AdminFinancialPaymentStatusCounts } from '@/features/admin/finance/payments';

export interface PaymentStatusDistributionProps {
  counts: AdminFinancialPaymentStatusCounts;
  title?: string;
  description?: string;
  className?: string;
}

const statusRows = [
  { status: 'pending', label: 'Pending', color: 'var(--warning)' },
  { status: 'processing', label: 'Processing', color: 'var(--brand)' },
  { status: 'succeeded', label: 'Succeeded', color: 'var(--success)' },
  { status: 'failed', label: 'Failed', color: 'var(--danger)' },
  { status: 'cancelled', label: 'Cancelled', color: 'var(--foreground-muted)' },
  { status: 'expired', label: 'Expired', color: 'var(--foreground-secondary)' },
] as const;

export function PaymentStatusDistribution({
  counts,
  title = 'Payment status distribution',
  description = 'Payment counts grouped by lifecycle status.',
  className,
}: PaymentStatusDistributionProps) {
  const total = statusRows.reduce(
    (sum, row) => sum + Math.max(0, counts[row.status] ?? 0),
    0,
  );

  return (
    <section
      aria-labelledby="payment-status-distribution-title"
      className={[
        'rounded-[var(--radius-xl)] border border-[var(--border)]',
        'bg-[var(--surface)] p-5 sm:p-6',
        className ?? '',
      ].join(' ')}
    >
      <div>
        <h2
          id="payment-status-distribution-title"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          {title}
        </h2>

        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          {description}
        </p>
      </div>

      <div className="mt-5 space-y-4">
        {statusRows.map((row) => {
          const count = Math.max(0, counts[row.status] ?? 0);
          const percentage = total > 0 ? (count / total) * 100 : 0;

          return (
            <div key={row.status}>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <span className="text-sm text-[var(--foreground-secondary)]">
                  {row.label}
                </span>

                <span className="text-sm font-semibold tabular-nums text-[var(--foreground)]">
                  {count.toLocaleString()}
                </span>
              </div>

              <div
                className="h-2 overflow-hidden rounded-full bg-[var(--background-muted)]"
                role="progressbar"
                aria-label={`${row.label} payments`}
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={count}
              >
                <div
                  className="h-full rounded-full transition-[width]"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: row.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[var(--border-subtle)] pt-4">
        <span className="text-sm text-[var(--foreground-secondary)]">
          Total represented
        </span>

        <span className="text-sm font-semibold tabular-nums text-[var(--foreground)]">
          {total.toLocaleString()}
        </span>
      </div>
    </section>
  );
}

export default PaymentStatusDistribution;