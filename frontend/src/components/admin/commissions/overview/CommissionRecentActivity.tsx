import { Card } from '@/components/ui';
import {
  CommissionAmount,
  CommissionDate,
  CommissionEmptyState,
  CommissionStatusBadge,
  CommissionTypeBadge,
} from '../shared';

export interface CommissionRecentActivityItem {
  readonly publicId: string;
  readonly type: 'BOOKING' | 'EARNING';
  readonly status: 'PENDING' | 'ASSESSED' | 'CANCELLED';
  readonly commissionAmount: number;
  readonly currency: string;
  readonly createdAt: string | Date;
  readonly description?: string;
}

export interface CommissionRecentActivityProps {
  readonly items: readonly CommissionRecentActivityItem[];
  readonly title?: string;
  readonly description?: string;
  readonly emptyMessage?: string;
  readonly className?: string;
}

export function CommissionRecentActivity({
  items,
  title = 'Recent Activity',
  description = 'Latest commission records.',
  emptyMessage = 'No recent commission activity found.',
  className,
}: CommissionRecentActivityProps) {
  return (
    <Card className={className} padding="md">
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-[var(--foreground)]">
          {title}
        </h3>

        <p className="text-sm text-[var(--foreground-secondary)]">
          {description}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="mt-5">
          <CommissionEmptyState
            title="No recent activity"
            description={emptyMessage}
          />
        </div>
      ) : (
        <div className="mt-5 divide-y divide-[var(--border-subtle)]">
          {items.map((item) => (
            <div
              key={item.publicId}
              className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <CommissionTypeBadge type={item.type} />
                  <CommissionStatusBadge status={item.status} />
                </div>

                <p className="text-sm font-medium text-[var(--foreground)]">
                  {item.description ?? `${item.type} commission`}
                </p>

                <p className="text-xs text-[var(--foreground-muted)]">
                  <CommissionDate value={item.createdAt} />
                </p>
              </div>

              <div className="shrink-0 sm:text-right">
                <p className="text-sm font-semibold tabular-nums text-[var(--foreground)]">
                  <CommissionAmount
                    amount={item.commissionAmount}
                    currency={item.currency}
                  />
                </p>

                <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                  Commission amount
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}