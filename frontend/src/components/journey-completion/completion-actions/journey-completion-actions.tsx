// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Actions
// -----------------------------------------------------------------------------
//
// Coordinates the complete action surface for Journey Completion.
//
// Responsibilities:
// - Compose Journey Completion lifecycle actions.
// - Pass the current completion projection to action components.
// - Keep action composition separate from mutation implementation.
//
// Non-responsibilities:
// - Does not perform API requests.
// - Does not own React Query mutations.
// - Does not reproduce aggregate business rules.
// - Does not determine whether an operation is ultimately authorized.
// - Does not mutate the Journey Completion model.
// - Does not decide whether an individual action is currently applicable.
//
// Individual action components are responsible for presenting their own
// applicable/hidden state according to the supplied completion projection and
// their mutation state.
//
// The backend JourneyCompletionAggregate remains authoritative for lifecycle
// transitions.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

import type {
  JourneyCompletion,
} from '@/features/journey-completion/models';

// -----------------------------------------------------------------------------
// UI
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui';

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

import { RequestCompletionAction } from './request-completion-action';
import { ConfirmCompletionAction } from './confirm-completion-action';
import { CancelCompletionAction } from './cancel-completion-action';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyCompletionActionsProps {
  /**
   * Current Journey Completion projection.
   *
   * The projection is passed unchanged to action components. No local copy or
   * derived domain state is maintained here.
   */
  completion: JourneyCompletion;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyCompletionActions({
  completion,
}: JourneyCompletionActionsProps) {
  return (
    <Card
      variant="default"
      padding="md"
      header={
        <div>
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Completion actions
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            Available actions for this completion.
          </p>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        {/* ----------------------------------------------------------------- */}
        {/* Request completion                                                 */}
        {/* ----------------------------------------------------------------- */}

        <RequestCompletionAction
          completion={completion}
        />

        {/* ----------------------------------------------------------------- */}
        {/* Confirm completion                                                 */}
        {/* ----------------------------------------------------------------- */}

        <ConfirmCompletionAction
          completion={completion}
        />

        {/* ----------------------------------------------------------------- */}
        {/* Cancel completion                                                  */}
        {/* ----------------------------------------------------------------- */}

        <CancelCompletionAction
          completion={completion}
        />
      </div>
    </Card>
  );
}