
import { cn } from '@/foundation/utils/cn';

import { JourneyCompletionStatusBadge } from '../shared/JourneyCompletionStatusBadge';
import { JourneyCompletionDate } from '../shared/JourneyCompletionDate';

import {
  AdminJourneyCompletionStatus,
  type AdminJourneyCompletionStatus as AdminJourneyCompletionStatusType,
} from '@/features/admin/journey-completion';

export interface JourneyCompletionOutcomePanelProps {
  status: AdminJourneyCompletionStatusType;
  confirmedCount: number;
  requiredConfirmations: number;
  confirmedAt?: string | Date | null;
  disputedAt?: string | Date | null;
  cancelledAt?: string | Date | null;
  className?: string;
}

const outcomeMessages: Record<AdminJourneyCompletionStatusType, string> = {
  [AdminJourneyCompletionStatus.PENDING]:
    'The journey completion is awaiting action.',

  [AdminJourneyCompletionStatus.CONFIRMATION_REQUIRED]:
    'Additional confirmations are required.',

  [AdminJourneyCompletionStatus.CONFIRMED]:
    'The journey completion has been confirmed.',

  [AdminJourneyCompletionStatus.DISPUTED]:
    'The journey completion is under dispute.',

  [AdminJourneyCompletionStatus.CANCELLED]:
    'The journey completion has been cancelled.',
};

export function JourneyCompletionOutcomePanel({
  status,
  confirmedCount,
  requiredConfirmations,
  confirmedAt,
  disputedAt,
  cancelledAt,
  className,
}: JourneyCompletionOutcomePanelProps) {
  const safeConfirmedCount = Number.isFinite(confirmedCount)
    ? Math.max(0, confirmedCount)
    : 0;

  const safeRequiredConfirmations = Number.isFinite(requiredConfirmations)
    ? Math.max(0, requiredConfirmations)
    : 0;

  const outcomeMessage =
    outcomeMessages[status] ??
    'The completion outcome is not available.';

  const confirmationResult =
    status === AdminJourneyCompletionStatus.CONFIRMED
      ? 'Confirmed'
      : status === AdminJourneyCompletionStatus.DISPUTED
        ? 'Disputed'
        : status === AdminJourneyCompletionStatus.CANCELLED
          ? 'Cancelled'
          : 'Not confirmed';

  return (
    <section
      aria-labelledby="journey-completion-outcome-heading"
      className={cn(
        'min-w-0 rounded-xl border border-[var(--border)]',
        'bg-[var(--surface)] p-5 shadow-sm',
        className,
      )}
    >
      <div>
        <h2
          id="journey-completion-outcome-heading"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          Completion outcome
        </h2>

        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Current outcome of the journey completion process.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Outcome status
          </p>

          <div className="mt-2">
            <JourneyCompletionStatusBadge status={status} />
          </div>
        </div>

        <p className="text-sm leading-relaxed text-[var(--foreground-secondary)] sm:max-w-sm sm:text-right">
          {outcomeMessage}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 border-t border-[var(--border-subtle)] pt-4 sm:grid-cols-2">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Confirmations received
          </p>

          <p className="text-sm font-semibold tabular-nums text-[var(--foreground)]">
            {safeConfirmedCount} of {safeRequiredConfirmations}
          </p>
        </div>

        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Confirmation result
          </p>

          <p className="text-sm font-medium text-[var(--foreground)]">
            {confirmationResult}
          </p>
        </div>

        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Confirmed at
          </p>

          <div className="text-sm text-[var(--foreground)]">
            <JourneyCompletionDate
              value={confirmedAt}
              format="datetime"
            />
          </div>
        </div>

        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Disputed at
          </p>

          <div className="text-sm text-[var(--foreground)]">
            <JourneyCompletionDate
              value={disputedAt}
              format="datetime"
            />
          </div>
        </div>

        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Cancelled at
          </p>

          <div className="text-sm text-[var(--foreground)]">
            <JourneyCompletionDate
              value={cancelledAt}
              format="datetime"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default JourneyCompletionOutcomePanel;
