
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Payment Method Activity Summary
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Summarize created and updated payment methods for the reporting period.
 * - Present the supplied registration activity series.
 * - Reuse PaymentMethodDate for consistent date formatting.
 * -----------------------------------------------------------------------------
 */

import { Card } from '@/components/ui';

import { PaymentMethodDate } from '../shared';

import type {
  AdminPaymentMethodActivityMetric,
  AdminPaymentMethodMetrics,
} from '@/features/admin/finance/payment-methods';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentMethodActivitySummaryProps {
  metrics: AdminPaymentMethodMetrics;
  activity: readonly AdminPaymentMethodActivityMetric[];
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentMethodActivitySummary({
  metrics,
  activity,
  className,
}: PaymentMethodActivitySummaryProps) {
  const maximum = Math.max(0, ...activity.map((item) => item.created));

  return (
    <Card
      padding="md"
      className={['min-w-0 shadow-none', className].filter(Boolean).join(' ')}
    >
      <div className="mb-5">
        <h3 className="text-base font-semibold text-[var(--foreground)]">
          Payment method activity
        </h3>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Registration activity and reporting-period changes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-[var(--radius-md)] bg-[var(--background-subtle)] p-4">
          <p className="text-sm text-[var(--foreground-secondary)]">
            Created this period
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--foreground)]">
            {metrics.createdThisPeriod}
          </p>
        </div>

        <div className="rounded-[var(--radius-md)] bg-[var(--background-subtle)] p-4">
          <p className="text-sm text-[var(--foreground-secondary)]">
            Updated this period
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--foreground)]">
            {metrics.updatedThisPeriod}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-semibold text-[var(--foreground)]">
          Registration timeline
        </h4>

        {activity.length === 0 ? (
          <p className="py-5 text-sm text-[var(--foreground-muted)]">
            No registration activity is available.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {activity.map((item) => {
              const percentage =
                maximum > 0 ? (item.created / maximum) * 100 : 0;

              return (
                <li
                  key={item.date}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"
                >
                  <div className="min-w-0">
                    <PaymentMethodDate date={item.date} />
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--background-muted)]">
                      <div
                        className="h-full rounded-full bg-[var(--brand)]"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  <span className="text-sm font-semibold tabular-nums text-[var(--foreground)]">
                    {item.created}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {metrics.generatedAt && (
        <p className="mt-5 border-t border-[var(--border-subtle)] pt-3 text-xs text-[var(--foreground-muted)]">
          Metrics generated: <PaymentMethodDate date={metrics.generatedAt} includeTime />
        </p>
      )}
    </Card>
  );
}

export default PaymentMethodActivitySummary;
