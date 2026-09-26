// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Settlement
// -----------------------------------------------------------------------------
//
// Presentation component for the settlement associated with a Journey
// Completion.
//
// Responsibilities:
// - display settlement state and lifecycle information;
// - display settlement identifiers and references;
// - delegate status rendering to JourneyCompletionSettlementStatus.
//
// Non-responsibilities:
// - settlement mutations;
// - settlement lifecycle orchestration;
// - financial operations;
// - authorization;
// - deriving settlement state from Journey Completion state.
//
// Settlement lifecycle is backend-authoritative. This component therefore
// renders the state supplied by the API rather than attempting to infer or
// transition it locally.
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui';

import type { JourneySettlement } from '@/features/journey-completion/models';

import { JourneyCompletionSettlementStatus } from './journey-completion-settlement-status';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyCompletionSettlementProps {
  settlement: JourneySettlement;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatDateTime(value?: string): string {
  if (!value) {
    return '—';
  }

  return new Date(value).toLocaleString();
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyCompletionSettlement({
  settlement,
}: JourneyCompletionSettlementProps) {
  return (
    <Card
      variant="default"
      padding="md"
      header={
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Settlement
            </h2>

            <JourneyCompletionSettlementStatus
              status={settlement.status}
            />
          </div>

          <p className="text-sm text-[var(--muted-foreground)]">
            Settlement associated with this completed journey.
          </p>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {/* -----------------------------------------------------------------
            Settlement identity
            ----------------------------------------------------------------- */}

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
              Settlement ID
            </p>
            <p className="mt-1 break-all text-sm text-[var(--foreground)]">
              {settlement.publicId}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
              Completion ID
            </p>
            <p className="mt-1 break-all text-sm text-[var(--foreground)]">
              {settlement.completionId}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
              Journey ID
            </p>
            <p className="mt-1 break-all text-sm text-[var(--foreground)]">
              {settlement.journeyPublicId}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
              Provider ID
            </p>
            <p className="mt-1 break-all text-sm text-[var(--foreground)]">
              {settlement.providerPublicId}
            </p>
          </div>
        </div>

        {/* -----------------------------------------------------------------
            Financial transaction
            ----------------------------------------------------------------- */}

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
            Financial transaction
          </p>

          <p className="mt-1 break-all text-sm text-[var(--foreground)]">
            {settlement.financialTransactionPublicId ?? 'Not available'}
          </p>
        </div>

        {/* -----------------------------------------------------------------
            Failure information
            ----------------------------------------------------------------- */}

        {settlement.failureReason && (
          <div className="rounded-[var(--radius-md)] border border-[var(--danger)]/20 bg-[var(--danger)]/5 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--danger)]">
              Failure reason
            </p>

            <p className="mt-1 text-sm text-[var(--foreground)]">
              {settlement.failureReason}
            </p>
          </div>
        )}

        {/* -----------------------------------------------------------------
            Lifecycle timestamps
            ----------------------------------------------------------------- */}

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
              Submitted
            </p>
            <p className="mt-1 text-sm text-[var(--foreground)]">
              {formatDateTime(settlement.submittedAt)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
              Processing
            </p>
            <p className="mt-1 text-sm text-[var(--foreground)]">
              {formatDateTime(settlement.processingAt)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
              Completed
            </p>
            <p className="mt-1 text-sm text-[var(--foreground)]">
              {formatDateTime(settlement.completedAt)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
              Held
            </p>
            <p className="mt-1 text-sm text-[var(--foreground)]">
              {formatDateTime(settlement.heldAt)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
              Failed
            </p>
            <p className="mt-1 text-sm text-[var(--foreground)]">
              {formatDateTime(settlement.failedAt)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
              Cancelled
            </p>
            <p className="mt-1 text-sm text-[var(--foreground)]">
              {formatDateTime(settlement.cancelledAt)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}