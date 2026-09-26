// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Disputes
// -----------------------------------------------------------------------------
//
// Presentation component for the disputes attached to a journey completion.
//
// Responsibilities:
// - render the supplied dispute projections;
// - provide an empty state when there are no disputes;
// - delegate individual dispute rendering to JourneyCompletionDispute.
//
// Non-responsibilities:
// - fetching disputes;
// - opening, withdrawing, resolving, or rejecting disputes;
// - authorization;
// - lifecycle decisions;
// - local model mutation.
//
// The component intentionally receives disputes as data so the parent can
// decide how the completion projection is obtained.
//
// -----------------------------------------------------------------------------

import { Card, EmptyState } from '@/components/ui';

import type { JourneyCompletionDispute as JourneyCompletionDisputeModel } from '@/features/journey-completion/models';

import { JourneyCompletionDispute } from './journey-completion-dispute';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyCompletionDisputesProps {
  /**
   * Disputes associated with the journey completion.
   */
  disputes: JourneyCompletionDisputeModel[];
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyCompletionDisputes({
  disputes,
}: JourneyCompletionDisputesProps) {
  // ---------------------------------------------------------------------------
  // Empty state
  // ---------------------------------------------------------------------------

  if (disputes.length === 0) {
    return (
      <Card
        variant="default"
        padding="md"
        header={
          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Disputes
            </h2>
            <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
              Disputes associated with this journey completion.
            </p>
          </div>
        }
      >
        <EmptyState
          title="No disputes"
          description="There are no disputes associated with this completion."
        />
      </Card>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Card
      variant="default"
      padding="md"
      header={
        <div>
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Disputes
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            Disputes associated with this journey completion.
          </p>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        {disputes.map((dispute) => (
          <JourneyCompletionDispute
            key={dispute.publicId}
            dispute={dispute}
          />
        ))}
      </div>
    </Card>
  );
}