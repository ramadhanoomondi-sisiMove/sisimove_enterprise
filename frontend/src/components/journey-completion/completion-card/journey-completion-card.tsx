// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Card
// -----------------------------------------------------------------------------
//
// Compact presentation component for a Journey Completion.
//
// Responsibilities:
// - present the completion identity and lifecycle state;
// - present confirmation progress;
// - present important completion timestamps;
// - optionally present settlement state;
// - compose existing presentation components.
//
// Non-responsibilities:
// - data fetching;
// - completion mutations;
// - dispute mutations;
// - settlement mutations;
// - authorization;
// - lifecycle orchestration;
// - deriving backend state.
//
// The parent owns discovery/query concerns and supplies the resolved models.
// Individual action components own their own mutations.
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui';

import type {
  JourneyCompletion,
  JourneySettlement,
} from '@/features/journey-completion/models';

import { JourneyCompletionProgress } from '../completion-progress/journey-completion-progress';
import { JourneyCompletionStatusBadge } from '../completion-status/journey-completion-status-badge';
import { JourneyCompletionSettlementStatus } from '../completion-settlement/journey-completion-settlement-status';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyCompletionCardProps {
  completion: JourneyCompletion;

  /**
   * Optional settlement associated with this completion.
   *
   * Settlement discovery remains outside this presentation component.
   */
  settlement?: JourneySettlement | null;

  /**
   * Whether confirmation progress should be displayed.
   *
   * Defaults to true.
   */
  showProgress?: boolean;

  /**
   * Whether settlement information should be displayed when available.
   *
   * Defaults to true.
   */
  showSettlement?: boolean;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyCompletionCard({
  completion,
  settlement,
  showProgress = true,
  showSettlement = true,
}: JourneyCompletionCardProps) {
  const hasSettlement = showSettlement && settlement != null;

  return (
    <Card
      variant="default"
      padding="md"
      header={
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                Journey completion
              </h2>

              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Completion for journey{' '}
                <span className="break-all font-medium text-[var(--foreground)]">
                  {completion.journeyPublicId}
                </span>
              </p>
            </div>

            <JourneyCompletionStatusBadge status={completion.status} />
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {/* -----------------------------------------------------------------
            Confirmation progress
            ----------------------------------------------------------------- */}

        {showProgress && (
          <JourneyCompletionProgress
            confirmedCount={completion.confirmedCount}
            requiredConfirmations={completion.requiredConfirmations}
            compact
          />
        )}

        {/* -----------------------------------------------------------------
            Completion references
            ----------------------------------------------------------------- */}

        <div className="grid gap-3 sm:grid-cols-2">
          <ReferenceValue
            label="Completion ID"
            value={completion.publicId}
          />

          <ReferenceValue
            label="Provider ID"
            value={completion.providerPublicId}
          />
        </div>

        {/* -----------------------------------------------------------------
            Completion lifecycle
            ----------------------------------------------------------------- */}

        <div className="grid gap-3 sm:grid-cols-2">
          <DateValue
            label="Requested"
            value={completion.completionRequestedAt}
          />

          <DateValue
            label="Confirmed"
            value={completion.confirmedAt}
          />

          {completion.disputedAt && (
            <DateValue
              label="Disputed"
              value={completion.disputedAt}
            />
          )}

          {completion.cancelledAt && (
            <DateValue
              label="Cancelled"
              value={completion.cancelledAt}
            />
          )}
        </div>

        {/* -----------------------------------------------------------------
            Settlement summary
            -----------------------------------------------------------------

            Settlement is displayed as a compact section rather than nesting
            JourneyCompletionSettlement's Card inside this Card.

            Settlement lifecycle remains backend/financial-domain owned.
            This component only observes and presents its current state.
            ----------------------------------------------------------------- */}

        {hasSettlement && settlement && (
          <div className="border-t border-[var(--border)] pt-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-[var(--foreground)]">
                  Settlement
                </h3>

                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  Financial settlement associated with this completion.
                </p>
              </div>

              <JourneyCompletionSettlementStatus
                status={settlement.status}
              />
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <ReferenceValue
                label="Settlement ID"
                value={settlement.publicId}
              />

              <ReferenceValue
                label="Financial transaction"
                value={
                  settlement.financialTransactionPublicId ??
                  'Not available'
                }
              />

              {settlement.completedAt && (
                <DateValue
                  label="Settlement completed"
                  value={settlement.completedAt}
                />
              )}

              {settlement.failedAt && (
                <DateValue
                  label="Settlement failed"
                  value={settlement.failedAt}
                />
              )}
            </div>

            {settlement.failureReason && (
              <div className="mt-3 rounded-[var(--radius-md)] border border-[var(--danger)]/20 bg-[var(--danger)]/5 p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--danger)]">
                  Failure reason
                </p>

                <p className="mt-1 text-sm text-[var(--foreground)]">
                  {settlement.failureReason}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

// -----------------------------------------------------------------------------
// Small presentation helpers
// -----------------------------------------------------------------------------

interface ReferenceValueProps {
  label: string;
  value: string;
}

function ReferenceValue({ label, value }: ReferenceValueProps) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
        {label}
      </p>

      <p className="mt-1 break-all text-sm text-[var(--foreground)]">
        {value}
      </p>
    </div>
  );
}

interface DateValueProps {
  label: string;
  value?: string;
}

function DateValue({ label, value }: DateValueProps) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
        {label}
      </p>

      <p className="mt-1 text-sm text-[var(--foreground)]">
        {formatDateTime(value)}
      </p>
    </div>
  );
}

function formatDateTime(value?: string): string {
  if (!value) {
    return '—';
  }

  return new Date(value).toLocaleString();
}