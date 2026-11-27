
import { cn } from '@/foundation/utils/cn';

import { JourneyCompletionPublicId } from '../shared/JourneyCompletionPublicId';
import { JourneyCompletionDate } from '../shared/JourneyCompletionDate';

import {
  AdminJourneySettlementStatus,
  type AdminJourneySettlement,
} from '@/features/admin/journey-completion';

export interface JourneyCompletionSettlementPanelProps {
  settlement: AdminJourneySettlement | null;
  className?: string;
}

const SETTLEMENT_STATUS_LABELS: Record<
  AdminJourneySettlementStatus,
  string
> = {
  [AdminJourneySettlementStatus.PENDING]: 'Pending',
  [AdminJourneySettlementStatus.SUBMITTED]: 'Submitted',
  [AdminJourneySettlementStatus.PROCESSING]: 'Processing',
  [AdminJourneySettlementStatus.COMPLETED]: 'Completed',
  [AdminJourneySettlementStatus.FAILED]: 'Failed',
  [AdminJourneySettlementStatus.HELD]: 'On hold',
  [AdminJourneySettlementStatus.CANCELLED]: 'Cancelled',
};

const SETTLEMENT_STATUS_STYLES: Record<
  AdminJourneySettlementStatus,
  string
> = {
  [AdminJourneySettlementStatus.PENDING]:
    'bg-[var(--background-muted)] text-[var(--foreground-secondary)]',
  [AdminJourneySettlementStatus.SUBMITTED]:
    'bg-[var(--brand-soft)] text-[var(--brand)]',
  [AdminJourneySettlementStatus.PROCESSING]:
    'bg-[var(--warning-soft)] text-[var(--warning)]',
  [AdminJourneySettlementStatus.COMPLETED]:
    'bg-[var(--success-soft)] text-[var(--success)]',
  [AdminJourneySettlementStatus.FAILED]:
    'bg-[var(--danger-soft)] text-[var(--danger)]',
  [AdminJourneySettlementStatus.HELD]:
    'bg-[var(--warning-soft)] text-[var(--warning)]',
  [AdminJourneySettlementStatus.CANCELLED]:
    'bg-[var(--background-muted)] text-[var(--foreground-muted)]',
};

export function JourneyCompletionSettlementPanel({
  settlement,
  className,
}: JourneyCompletionSettlementPanelProps) {
  if (!settlement) {
    return (
      <section
        className={cn(
          'rounded-xl border border-[var(--border)]',
          'bg-[var(--surface)] p-5 shadow-sm',
          className,
        )}
      >
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          Settlement information
        </h2>

        <p className="mt-2 text-sm text-[var(--foreground-muted)]">
          No settlement record is associated with this completion.
        </p>
      </section>
    );
  }

  const timeline = [
    { label: 'Submitted', value: settlement.submittedAt },
    { label: 'Processing started', value: settlement.processingAt },
    { label: 'Completed', value: settlement.completedAt },
    { label: 'Failed', value: settlement.failedAt },
    { label: 'Put on hold', value: settlement.heldAt },
    { label: 'Cancelled', value: settlement.cancelledAt },
  ];

  return (
    <section
      className={cn(
        'rounded-xl border border-[var(--border)]',
        'bg-[var(--surface)] p-5 shadow-sm',
        className,
      )}
    >
      <div>
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          Settlement information
        </h2>

        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Financial settlement associated with this journey completion.
        </p>
      </div>

      <div className="mt-5 space-y-4 border-t border-[var(--border-subtle)] pt-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Settlement public ID
          </p>

          <div className="mt-2">
            <JourneyCompletionPublicId
              publicId={settlement.publicId}
              maxLength={32}
            />
          </div>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Settlement status
          </p>

          <span
            className={cn(
              'mt-2 inline-flex rounded-full px-3 py-1',
              'text-xs font-semibold',
              SETTLEMENT_STATUS_STYLES[settlement.status],
            )}
          >
            {SETTLEMENT_STATUS_LABELS[settlement.status]}
          </span>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Financial transaction public ID
          </p>

          <div className="mt-2">
            {settlement.financialTransactionPublicId ? (
              <JourneyCompletionPublicId
                publicId={settlement.financialTransactionPublicId}
                maxLength={32}
              />
            ) : (
              <span className="text-sm text-[var(--foreground-muted)]">
                Not available
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-[var(--border-subtle)] pt-4">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">
          Settlement timeline
        </h3>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {timeline.map((event) => (
            <div key={event.label}>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                {event.label}
              </p>

              <div className="mt-1">
                <JourneyCompletionDate
                  value={event.value}
                  format="datetime"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {settlement.failureReason && (
        <div className="mt-5 rounded-lg border border-[var(--danger)]/20 bg-[var(--danger-soft)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--danger)]">
            Failure reason
          </p>

          <p className="mt-2 text-sm text-[var(--foreground)]">
            {settlement.failureReason}
          </p>
        </div>
      )}

      <div className="mt-5 border-t border-[var(--border-subtle)] pt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Created
            </p>
            <div className="mt-1">
              <JourneyCompletionDate
                value={settlement.createdAt}
                format="datetime"
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Last updated
            </p>
            <div className="mt-1">
              <JourneyCompletionDate
                value={settlement.updatedAt}
                format="datetime"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default JourneyCompletionSettlementPanel;
