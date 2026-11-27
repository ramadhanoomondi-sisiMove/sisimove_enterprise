
import { cn } from '@/foundation/utils/cn';

import { JourneyCompletionDate } from '../shared/JourneyCompletionDate';

export interface JourneyCompletionInformationPanelProps {
  completionRequestedAt?: string | Date | null;
  confirmedAt?: string | Date | null;
  disputedAt?: string | Date | null;
  cancelledAt?: string | Date | null;
  requiredConfirmations: number;
  confirmedCount: number;
  className?: string;
}

export function JourneyCompletionInformationPanel({
  completionRequestedAt,
  confirmedAt,
  disputedAt,
  cancelledAt,
  requiredConfirmations,
  confirmedCount,
  className,
}: JourneyCompletionInformationPanelProps) {
  const safeRequiredConfirmations =
    Number.isFinite(requiredConfirmations)
      ? Math.max(0, requiredConfirmations)
      : 0;

  const safeConfirmedCount =
    Number.isFinite(confirmedCount)
      ? Math.max(0, confirmedCount)
      : 0;

  const displayedConfirmedCount = Math.min(
    safeConfirmedCount,
    safeRequiredConfirmations,
  );

  const confirmationProgress =
    safeRequiredConfirmations > 0
      ? Math.round(
          (displayedConfirmedCount / safeRequiredConfirmations) * 100,
        )
      : 0;

  const timestamps = [
    {
      label: 'Completion requested',
      value: completionRequestedAt,
    },
    {
      label: 'Confirmed',
      value: confirmedAt,
    },
    {
      label: 'Disputed',
      value: disputedAt,
    },
    {
      label: 'Cancelled',
      value: cancelledAt,
    },
  ];

  return (
    <section
      aria-labelledby="journey-completion-information-heading"
      className={cn(
        'min-w-0 rounded-xl border border-[var(--border)]',
        'bg-[var(--surface)] p-5 shadow-sm',
        className,
      )}
    >
      <div>
        <h2
          id="journey-completion-information-heading"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          Completion information
        </h2>

        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Confirmation progress and important completion dates.
        </p>
      </div>

      <div className="mt-5 border-t border-[var(--border-subtle)] pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-[var(--foreground-secondary)]">
            Confirmation progress
          </p>

          <p className="text-sm font-semibold tabular-nums text-[var(--foreground)]">
            {safeConfirmedCount} / {safeRequiredConfirmations}
          </p>
        </div>

        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--background-muted)]"
          role="progressbar"
          aria-label="Confirmation progress"
          aria-valuemin={0}
          aria-valuemax={safeRequiredConfirmations}
          aria-valuenow={displayedConfirmedCount}
          aria-valuetext={
            safeRequiredConfirmations > 0
              ? `${safeConfirmedCount} of ${safeRequiredConfirmations} confirmations received`
              : 'No confirmations required'
          }
        >
          <div
            className="h-full rounded-full bg-[var(--brand)] transition-[width] duration-300"
            style={{ width: `${confirmationProgress}%` }}
          />
        </div>

        <p className="mt-2 text-xs text-[var(--foreground-muted)]">
          {safeRequiredConfirmations > 0
            ? `${confirmationProgress}% of required confirmations received`
            : 'No confirmations required'}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 border-t border-[var(--border-subtle)] pt-4 sm:grid-cols-2">
        {timestamps.map(({ label, value }) => (
          <div key={label} className="min-w-0 space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              {label}
            </p>

            <div className="text-sm text-[var(--foreground)]">
              <JourneyCompletionDate
                value={value}
                format="datetime"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default JourneyCompletionInformationPanel;
