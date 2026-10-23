// src/features/admin/boardings/overview/BoardingLifecycleSummary.tsx

import { Badge } from '@/components/ui/badge';

import { AdminBoardingStatus } from '@/features/admin/boardings';
import type {
  AdminBoardingStatusCounts,
} from '@/features/admin/boardings';

import { BoardingMetricCard } from './BoardingMetricCard';

import { cn } from '@/foundation/utils/cn';

export interface BoardingLifecycleSummaryProps {
  statusCounts: AdminBoardingStatusCounts;
  className?: string;
}

const lifecycleItems = [
  {
    status: AdminBoardingStatus.NOT_STARTED,
    label: 'Not started',
    description: 'Awaiting boarding',
    variant: 'default',
  },
  {
    status: AdminBoardingStatus.BOARDING,
    label: 'Boarding',
    description: 'Boarding in progress',
    variant: 'brand',
  },
  {
    status: AdminBoardingStatus.STARTED,
    label: 'Started',
    description: 'Journey started',
    variant: 'success',
  },
  {
    status: AdminBoardingStatus.CANCELLED,
    label: 'Cancelled',
    description: 'Boarding cancelled',
    variant: 'danger',
  },
] as const;

export function BoardingLifecycleSummary({
  statusCounts,
  className,
}: BoardingLifecycleSummaryProps) {
  const total = Object.values(statusCounts).reduce(
    (sum, count) => sum + count,
    0,
  );

  return (
    <section
      aria-labelledby="boarding-lifecycle-heading"
      className={cn('space-y-4', className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2
            id="boarding-lifecycle-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Boarding lifecycle
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Distribution of boarding records by current status.
          </p>
        </div>

        <Badge variant="outline">
          {total.toLocaleString()} total
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {lifecycleItems.map((item) => (
          <BoardingMetricCard
            key={item.status}
            label={item.label}
            value={statusCounts[item.status]}
            description={item.description}
            accent={
              item.variant === 'brand'
                ? 'brand'
                : item.variant === 'success'
                  ? 'success'
                  : item.variant === 'danger'
                    ? 'danger'
                    : 'default'
            }
          />
        ))}
      </div>
    </section>
  );
}
