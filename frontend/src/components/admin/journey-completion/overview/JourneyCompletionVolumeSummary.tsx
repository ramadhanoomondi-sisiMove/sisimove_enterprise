
import type {
  AdminJourneyCompletionMetrics,
} from '@/features/admin/journey-completion/models';
import { JourneyCompletionMetricCard } from './JourneyCompletionMetricCard';

export interface JourneyCompletionVolumeSummaryProps {
  metrics: AdminJourneyCompletionMetrics;
  className?: string;
}

export function JourneyCompletionVolumeSummary({
  metrics,
  className,
}: JourneyCompletionVolumeSummaryProps) {
  return (
    <section
      className={`rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 ${className ?? ''}`}
      aria-labelledby="journey-completion-volume-heading"
    >
      <div className="mb-4">
        <h3
          id="journey-completion-volume-heading"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          Completion volume
        </h3>
        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Current completion record totals.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <JourneyCompletionMetricCard
          label="All completions"
          value={metrics.totalCompletions.toLocaleString()}
          description="Total records in the supplied dataset"
          tone="brand"
        />

        <JourneyCompletionMetricCard
          label="Confirmed"
          value={metrics.confirmedCount.toLocaleString()}
          description="Completions confirmed by the required parties"
          tone="success"
        />

        <JourneyCompletionMetricCard
          label="Awaiting confirmation"
          value={metrics.confirmationRequiredCount.toLocaleString()}
          description="Confirmation is still required"
          tone="warning"
        />

        <JourneyCompletionMetricCard
          label="Disputed"
          value={metrics.disputedCount.toLocaleString()}
          description="Completions with an active disputed status"
          tone="danger"
        />
      </div>
    </section>
  );
}
