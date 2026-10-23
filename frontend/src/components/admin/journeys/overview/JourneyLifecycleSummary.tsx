
import {
  Activity,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Route,
  XCircle,
} from 'lucide-react';

import { JourneyStatusBadge } from '@/components/admin/journeys/shared/JourneyStatusBadge';
import { cn } from '@/foundation/utils/cn';
import type {
  JourneyLifecycleMetrics,
} from '@/features/admin/journeys/models/journey-metrics.model';
import type { JourneyStatus } from '@/features/admin/journeys/models/journey.enums';

export interface JourneyLifecycleSummaryProps {
  metrics: JourneyLifecycleMetrics;
  className?: string;
  onStatusSelect?: (status: JourneyStatus) => void;
}

const LIFECYCLE_ITEMS: {
  status: JourneyStatus;
  label: string;
  icon: typeof Activity;
  iconClassName: string;
}[] = [
  {
    status: 'DRAFT',
    label: 'Draft',
    icon: CircleDashed,
    iconClassName: 'text-[var(--foreground-muted)]',
  },
  {
    status: 'PUBLISHED',
    label: 'Published',
    icon: Route,
    iconClassName: 'text-[var(--success)]',
  },
  {
    status: 'FULL',
    label: 'Full',
    icon: CheckCircle2,
    iconClassName: 'text-[var(--warning)]',
  },
  {
    status: 'BOARDING',
    label: 'Boarding',
    icon: Activity,
    iconClassName: 'text-[var(--brand)]',
  },
  {
    status: 'IN_PROGRESS',
    label: 'In progress',
    icon: Activity,
    iconClassName: 'text-[var(--brand)]',
  },
  {
    status: 'COMPLETION_PENDING',
    label: 'Awaiting completion',
    icon: Clock3,
    iconClassName: 'text-[var(--warning)]',
  },
  {
    status: 'COMPLETED',
    label: 'Completed',
    icon: CheckCircle2,
    iconClassName: 'text-[var(--success)]',
  },
  {
    status: 'CANCELLED',
    label: 'Cancelled',
    icon: XCircle,
    iconClassName: 'text-[var(--danger)]',
  },
  {
    status: 'EXPIRED',
    label: 'Expired',
    icon: Clock3,
    iconClassName: 'text-[var(--foreground-muted)]',
  },
];

export function JourneyLifecycleSummary({
  metrics,
  className,
  onStatusSelect,
}: JourneyLifecycleSummaryProps) {
  const total = Math.max(0, metrics.total);

  return (
    <section
      aria-labelledby="journey-lifecycle-summary-title"
      className={cn(
        'rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]',
        className,
      )}
    >
      <div className="flex flex-col gap-3 border-b border-[var(--border)] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">
            Lifecycle distribution
          </p>
          <h2
            id="journey-lifecycle-summary-title"
            className="mt-1 text-lg font-semibold tracking-tight text-[var(--foreground)]"
          >
            Journey status overview
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Distribution across the supported journey lifecycle states.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--background-subtle)] px-4 py-3">
          <p className="text-xs font-medium text-[var(--foreground-muted)]">
            Total journeys
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--foreground)]">
            {total.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
        {LIFECYCLE_ITEMS.map((item) => {
          const count = Math.max(0, metrics.byStatus[item.status] ?? 0);
          const percentage =
            total > 0 ? Math.min(100, (count / total) * 100) : 0;
          const Icon = item.icon;

          const content = (
            <div className="flex h-full flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--background-subtle)] p-4 transition-colors group-hover:border-[var(--border)] group-hover:bg-[var(--surface)]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <Icon
                    aria-hidden="true"
                    className={cn('size-4 shrink-0', item.iconClassName)}
                  />
                  <span className="text-sm font-medium text-[var(--foreground-secondary)]">
                    {item.label}
                  </span>
                </div>

                <span className="text-lg font-semibold tabular-nums text-[var(--foreground)]">
                  {count.toLocaleString()}
                </span>
              </div>

              <div
                className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--border)]"
                role="progressbar"
                aria-label={`${item.label} share of journeys`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Number(percentage.toFixed(1))}
              >
                <div
                  className="h-full rounded-full bg-[var(--brand)] transition-[width] duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <JourneyStatusBadge status={item.status} />
                <span className="text-xs tabular-nums text-[var(--foreground-muted)]">
                  {percentage.toLocaleString(undefined, {
                    maximumFractionDigits: 1,
                  })}
                  %
                </span>
              </div>
            </div>
          );

          return onStatusSelect ? (
            <button
              key={item.status}
              type="button"
              onClick={() => onStatusSelect(item.status)}
              aria-label={`Filter journeys by ${item.label}`}
              className="group min-w-0 rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
            >
              {content}
            </button>
          ) : (
            <div key={item.status} className="group min-w-0">
              {content}
            </div>
          );
        })}
      </div>

      {total === 0 && (
        <p className="px-5 pb-5 text-sm text-[var(--foreground-muted)] sm:px-6">
          No journey counts are available yet. Lifecycle percentages will appear
          when the metrics source provides data.
        </p>
      )}
    </section>
  );
}

export default JourneyLifecycleSummary;
