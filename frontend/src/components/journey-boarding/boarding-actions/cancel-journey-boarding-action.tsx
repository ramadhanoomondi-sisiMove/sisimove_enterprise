// -----------------------------------------------------------------------------
// sisiMove — Cancel Journey Boarding Action
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Present the provider with the Journey Boarding cancellation action.
// - Require explicit confirmation before cancelling boarding.
// - Execute the cancellation through useCancelJourneyBoarding.
// - Keep lifecycle authorization in the backend aggregate.
// - Surface mutation errors without introducing domain rules.
//
// Architectural rules:
// - This component contains presentation and interaction orchestration only.
// - It does not perform HTTP requests directly.
// - It does not determine whether cancellation is domain-valid.
// - The backend JourneyBoardingAggregate remains authoritative.
// - Public identifiers remain opaque strings.
// - Cancellation is never treated as deletion.
// - Consequential actions require explicit confirmation.
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import { useState } from 'react';

// -----------------------------------------------------------------------------
// UI
// -----------------------------------------------------------------------------

import {
  Button,
  Dialog,
} from '@/components/ui';

// -----------------------------------------------------------------------------
// Feature
// -----------------------------------------------------------------------------

import {
  JourneyBoardingStatus,
  type JourneyBoarding,
} from '@/features/journey-boarding/models';

import { useCancelJourneyBoarding } from '@/features/journey-boarding/hooks';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface CancelJourneyBoardingActionProps {
  /**
   * Current Journey Boarding aggregate projection.
   */
  boarding: JourneyBoarding;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

/**
 * Provider action for cancelling Journey Boarding.
 *
 * Cancellation is intentionally confirmation-based because it is a
 * consequential lifecycle operation.
 *
 * The component only uses the known lifecycle states to determine whether
 * the action is relevant to the current UI. The backend remains authoritative
 * for the actual transition and may reject the operation if its aggregate
 * rules are not satisfied.
 */
export function CancelJourneyBoardingAction({
  boarding,
}: CancelJourneyBoardingActionProps) {
  // ---------------------------------------------------------------------------
  // Confirmation state
  // ---------------------------------------------------------------------------

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  // ---------------------------------------------------------------------------
  // Mutation
  // ---------------------------------------------------------------------------

  const cancelJourneyBoarding = useCancelJourneyBoarding();

  // ---------------------------------------------------------------------------
  // Applicability
  // ---------------------------------------------------------------------------
  //
  // Cancellation is a pre-start lifecycle operation.
  //
  // STARTED is terminal from the perspective of boarding cancellation, while
  // CANCELLED is already in the requested terminal state.
  //
  // This is intentionally only a UI applicability check. The backend
  // aggregate remains authoritative over whether cancellation is allowed.
  // ---------------------------------------------------------------------------

  if (
    boarding.status === JourneyBoardingStatus.STARTED ||
    boarding.status === JourneyBoardingStatus.CANCELLED
  ) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleCancel = () => {
    cancelJourneyBoarding.mutate(
      {
        params: {
          journeyBoardingPublicId: boarding.publicId,
        },
        request: {
          cancelledAt: new Date().toISOString(),
        },
      },
      {
        onSuccess: () => {
          setIsConfirmationOpen(false);
        },
      },
    );
  };

  /**
   * Prevents the confirmation dialog from being dismissed while the
   * cancellation request is in flight.
   *
   * This avoids leaving the user with an ambiguous UI state while the
   * consequential operation is being submitted.
   */
  const handleOpenChange = (open: boolean) => {
    if (cancelJourneyBoarding.isPending) {
      return;
    }

    setIsConfirmationOpen(open);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      <Button
        type="button"
        variant="danger"
        size="md"
        disabled={cancelJourneyBoarding.isPending}
        onClick={() => setIsConfirmationOpen(true)}
      >
        Cancel boarding
      </Button>

      <Dialog
        open={isConfirmationOpen}
        onOpenChange={handleOpenChange}
        title="Cancel boarding?"
        description="This will cancel the current Journey Boarding process. This action cannot be undone."
        closeOnBackdropClick={!cancelJourneyBoarding.isPending}
        closeOnEscape={!cancelJourneyBoarding.isPending}
        footer={
          <>
            <Button
              type="button"
              variant="ghost"
              disabled={cancelJourneyBoarding.isPending}
              onClick={() => setIsConfirmationOpen(false)}
            >
              Keep boarding
            </Button>

            <Button
              type="button"
              variant="danger"
              loading={cancelJourneyBoarding.isPending}
              disabled={cancelJourneyBoarding.isPending}
              onClick={handleCancel}
            >
              {cancelJourneyBoarding.isPending
                ? 'Cancelling…'
                : 'Confirm cancellation'}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm leading-6 text-[var(--foreground-secondary)]">
            Cancel the boarding process only if this journey will no longer
            proceed through the current boarding operation.
          </p>

          {cancelJourneyBoarding.isError && (
            <p
              role="alert"
              className="rounded-[var(--radius-md)] border border-[var(--danger)] bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]"
            >
              {cancelJourneyBoarding.error.message}
            </p>
          )}
        </div>
      </Dialog>
    </>
  );
}