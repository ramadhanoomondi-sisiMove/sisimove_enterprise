
import type {
  AdminJourneyCompletionMetrics,
} from '@/features/admin/journey-completion/models';
import { JourneyCompletionMetricCard } from './JourneyCompletionMetricCard';

export interface JourneyCompletionPerformanceSummaryProps {
  metrics: AdminJourneyCompletionMetrics;
  className?: string;
}

export function JourneyCompletionPerformanceSummary({
  metrics,
  className,
}: JourneyCompletionPerformanceSummaryProps) {
  const confirmation = metrics.confirmationMetrics;

  return (
    <section
      className={`rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 ${className ?? ''}`}
      aria-labelledby="journey-completion-performance-heading"
    >
      <div className="mb-4">
        <h3
          id="journey-completion-performance-heading"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          Confirmation performance
        </h3>
        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Confirmation progress across the supplied completion records.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <JourneyCompletionMetricCard
          label="Confirmation rate"
          value={`${confirmation.confirmationCompletionRate}%`}
          description="Confirmed confirmations against required confirmations"
          tone="success"
        />

        <JourneyCompletionMetricCard
          label="Required confirmations"
          value={confirmation.totalRequiredConfirmations.toLocaleString()}
          description="Total confirmations required"
        />

        <JourneyCompletionMetricCard
          label="Confirmed confirmations"
          value={confirmation.totalConfirmedConfirmations.toLocaleString()}
          description="Total confirmations received"
          tone="success"
        />

        <JourneyCompletionMetricCard
          label="Remaining confirmations"
          value={confirmation.remainingConfirmations.toLocaleString()}
          description="Required confirmations not yet received"
          tone={confirmation.remainingConfirmations > 0 ? 'warning' : 'success'}
        />
      </div>
    </section>
  );
}
