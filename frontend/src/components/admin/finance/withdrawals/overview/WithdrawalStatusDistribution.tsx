/**
 * SisiMove Admin — Withdrawal Status Distribution
 *
 * Displays withdrawal counts and percentages by lifecycle status.
 */

import { Card } from '@/components/ui';

import type { AdminWithdrawalMetrics } from '@/features/admin/finance/withdrawals/models/admin-withdrawal-metrics.model';

import type { AdminWithdrawalStatus } from '@/features/admin/finance/withdrawals/models/admin-withdrawal.enums';

import { WithdrawalStatusBadge } from '../shared/WithdrawalStatusBadge';

interface StatusPresentation {
  status: AdminWithdrawalStatus;
  barClassName: string;
}

const STATUS_PRESENTATION: readonly StatusPresentation[] = [
  {
    status: 'PENDING',
    barClassName: 'bg-[var(--warning)]',
  },
  {
    status: 'PROCESSING',
    barClassName: 'bg-[var(--brand)]',
  },
  {
    status: 'COMPLETED',
    barClassName: 'bg-[var(--success)]',
  },
  {
    status: 'FAILED',
    barClassName: 'bg-[var(--danger)]',
  },
  {
    status: 'CANCELLED',
    barClassName: 'bg-[var(--foreground-subtle)]',
  },
];

export interface WithdrawalStatusDistributionProps {
  metrics: AdminWithdrawalMetrics;
  className?: string;
}

export function WithdrawalStatusDistribution({
  metrics,
  className,
}: WithdrawalStatusDistributionProps) {
  const total = metrics.totalWithdrawals;

  return (
    <Card className={className}>
      <div className="mb-5">
        <h3 className="text-base font-semibold text-[var(--foreground)]">
          Withdrawal Status
        </h3>

        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Distribution of withdrawal requests by lifecycle status.
        </p>
      </div>

      <div className="space-y-5">
        {STATUS_PRESENTATION.map(({ status, barClassName }) => {
          const count = metrics.statusCounts[status];

          const percentage =
            total > 0 ? (count / total) * 100 : 0;

          return (
            <div key={status}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <WithdrawalStatusBadge status={status} />

                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold tabular-nums text-[var(--foreground)]">
                    {count.toLocaleString('en-KE')}
                  </span>

                  <span className="min-w-12 text-right text-[var(--foreground-muted)]">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div
                className="h-2 overflow-hidden rounded-full bg-[var(--background-muted)]"
                role="progressbar"
                aria-label={`${status.toLowerCase()} withdrawals`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Number(percentage.toFixed(1))}
              >
                <div
                  className={[
                    'h-full rounded-full transition-[width] duration-300',
                    barClassName,
                  ].join(' ')}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {total === 0 && (
        <p className="mt-4 text-sm text-[var(--foreground-muted)]">
          No withdrawal records are available yet.
        </p>
      )}
    </Card>
  );
}