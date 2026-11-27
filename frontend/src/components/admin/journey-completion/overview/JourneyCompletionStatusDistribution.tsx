
import {
  AdminJourneyCompletionStatus,
} from '@/features/admin/journey-completion/models';
import type {
  AdminJourneyCompletionMetrics,
} from '@/features/admin/journey-completion/models';
import { JourneyCompletionStatusBadge } from '../shared';

export interface JourneyCompletionStatusDistributionProps {
  metrics: AdminJourneyCompletionMetrics;
  className?: string;
}

const STATUS_ORDER: AdminJourneyCompletionStatus[] = [
  AdminJourneyCompletionStatus.PENDING,
  AdminJourneyCompletionStatus.CONFIRMATION_REQUIRED,
  AdminJourneyCompletionStatus.CONFIRMED,
  AdminJourneyCompletionStatus.DISPUTED,
  AdminJourneyCompletionStatus.CANCELLED,
];

function getStatusCount(
  metrics: AdminJourneyCompletionMetrics,
  status: AdminJourneyCompletionStatus,
): number {
  return metrics.statusCounts[status] ?? 0;
}

export function JourneyCompletionStatusDistribution({
  metrics,
  className,
}: JourneyCompletionStatusDistributionProps) {
  const total = metrics.totalCompletions;

  return (
    <section
      className={`rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 ${className ?? ''}`}
      aria-labelledby="journey-completion-status-heading"
    >
      <div className="mb-5">
        <h3
          id="journey-completion-status-heading"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          Status distribution
        </h3>
        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          How journey completions are currently distributed by status.
        </p>
      </div>

      <div className="space-y-4">
        {STATUS_ORDER.map((status) => {
          const count = getStatusCount(metrics, status);
          const percentage =
            total > 0 ? Math.round((count / total) * 100) : 0;

          return (
            <div key={status}>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <JourneyCompletionStatusBadge status={status} />
                <span className="text-sm font-medium tabular-nums text-[var(--foreground)]">
                  {count.toLocaleString()} ({percentage}%)
                </span>
              </div>

              <div
                className="h-2 overflow-hidden rounded-full bg-[var(--background-muted)]"
                role="progressbar"
                aria-label={`${status.replaceAll('_', ' ').toLowerCase()} share`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percentage}
              >
                <div
                  className="h-full rounded-full bg-[var(--brand)] transition-[width]"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-4">
        <span className="text-sm text-[var(--foreground-secondary)]">
          Total completions
        </span>
        <span className="text-sm font-semibold tabular-nums text-[var(--foreground)]">
          {total.toLocaleString()}
        </span>
      </div>
    </section>
  );
}
