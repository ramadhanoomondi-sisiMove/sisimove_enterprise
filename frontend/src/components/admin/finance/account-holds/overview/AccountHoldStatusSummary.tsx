// src/components/admin/finance/account-holds/overview/AccountHoldStatusSummary.tsx

import {
  CheckCircle2,
  CircleX,
  Clock3,
  ShieldCheck,
  Wallet,
} from 'lucide-react';

import { AdminAccountHoldStatus } from '@/features/admin/finance/account-holds/models';
import type { AdminAccountHoldMetrics } from '@/features/admin/finance/account-holds/models';
import { cn } from '@/foundation/utils/cn';

export interface AccountHoldStatusSummaryProps {
  metrics: AdminAccountHoldMetrics;
  className?: string;
}

const STATUS_ITEMS = [
  {
    status: AdminAccountHoldStatus.ACTIVE,
    label: 'Active',
    description: 'Funds currently on hold',
    icon: ShieldCheck,
    color: 'text-[var(--warning)]',
    background: 'bg-[var(--warning-soft)]',
    bar: 'bg-[var(--warning)]',
  },
  {
    status: AdminAccountHoldStatus.RELEASED,
    label: 'Released',
    description: 'Funds released back',
    icon: CheckCircle2,
    color: 'text-[var(--success)]',
    background: 'bg-[var(--success-soft)]',
    bar: 'bg-[var(--success)]',
  },
  {
    status: AdminAccountHoldStatus.CAPTURED,
    label: 'Captured',
    description: 'Funds captured',
    icon: Wallet,
    color: 'text-[var(--brand)]',
    background: 'bg-[var(--brand-soft)]',
    bar: 'bg-[var(--brand)]',
  },
  {
    status: AdminAccountHoldStatus.CANCELLED,
    label: 'Cancelled',
    description: 'Holds cancelled',
    icon: CircleX,
    color: 'text-[var(--foreground-muted)]',
    background: 'bg-[var(--background-muted)]',
    bar: 'bg-[var(--foreground-subtle)]',
  },
] as const;

export function AccountHoldStatusSummary({
  metrics,
  className,
}: AccountHoldStatusSummaryProps) {
  const total = Math.max(metrics.totalHolds, 0);

  const counts: Record<AdminAccountHoldStatus, number> = {
    [AdminAccountHoldStatus.ACTIVE]: metrics.activeHolds,
    [AdminAccountHoldStatus.RELEASED]: metrics.releasedHolds,
    [AdminAccountHoldStatus.CAPTURED]: metrics.capturedHolds,
    [AdminAccountHoldStatus.CANCELLED]: metrics.cancelledHolds,
  };

  return (
    <section
      aria-labelledby="account-hold-status-summary-title"
      className={cn(
        'rounded-[var(--radius-xl)] border border-[var(--border)]',
        'bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2
            id="account-hold-status-summary-title"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Hold status
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Distribution of recorded holds
          </p>
        </div>

        <span className="rounded-[var(--radius-md)] bg-[var(--background-muted)] px-3 py-1.5 text-sm font-semibold tabular-nums text-[var(--foreground)]">
          {total.toLocaleString('en-KE')}
        </span>
      </div>

      <div className="mt-6 space-y-5">
        {STATUS_ITEMS.map((item) => {
          const count = Math.max(counts[item.status], 0);
          const percentage =
            total > 0 ? Math.min((count / total) * 100, 100) : 0;
          const Icon = item.icon;

          return (
            <div key={item.status}>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex size-10 shrink-0 items-center justify-center',
                    'rounded-[var(--radius-md)]',
                    item.background,
                    item.color,
                  )}
                >
                  <Icon aria-hidden="true" className="size-5" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold tabular-nums text-[var(--foreground)]">
                      {count.toLocaleString('en-KE')}
                      <span className="ml-2 text-xs font-normal text-[var(--foreground-muted)]">
                        {percentage.toFixed(1)}%
                      </span>
                    </p>
                  </div>

                  <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
                    {item.description}
                  </p>
                </div>
              </div>

              <div
                className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--background-muted)]"
                role="progressbar"
                aria-label={`${item.label} holds`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Number(percentage.toFixed(1))}
              >
                <div
                  className={cn('h-full rounded-full transition-[width]', item.bar)}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {metrics.expiredActiveHolds > 0 && (
        <div className="mt-6 flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--warning)]/20 bg-[var(--warning-soft)] p-3">
          <Clock3
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-[var(--warning)]"
          />
          <p className="text-sm text-[var(--foreground-secondary)]">
            <span className="font-semibold text-[var(--foreground)]">
              {metrics.expiredActiveHolds.toLocaleString('en-KE')}
            </span>{' '}
            active {metrics.expiredActiveHolds === 1 ? 'hold has' : 'holds have'}{' '}
            expired and may need review.
          </p>
        </div>
      )}
    </section>
  );
}