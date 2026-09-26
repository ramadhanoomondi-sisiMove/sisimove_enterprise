// -----------------------------------------------------------------------------
// sisiMove — Withdraw Participant Action
// -----------------------------------------------------------------------------
//
// Presents the passenger operation for withdrawing from Journey Boarding.
//
// Responsibilities:
// - Present the withdrawal operation when the participant is eligible from the
//   current client projection.
// - Require explicit confirmation before the consequential transition.
// - Build the variables expected by useWithdrawParticipant.
// - Invoke the withdrawal mutation.
// - Present mutation progress and failure feedback.
//
// Non-responsibilities:
// - Does not perform HTTP requests.
// - Does not own participant lifecycle rules.
// - Does not perform authorization.
// - Does not mutate the JourneyBoarding model locally.
//
// The backend JourneyBoardingAggregate remains authoritative for the actual
// participant transition.
// -----------------------------------------------------------------------------

import { useState } from 'react';

import {
  Button,
  Dialog,
} from '@/components/ui';

import {
  JourneyBoardingParticipantStatus,
  type JourneyBoarding,
  type JourneyBoardingParticipant,
} from '@/features/journey-boarding/models';

import { useWithdrawParticipant } from '@/features/journey-boarding/hooks';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface WithdrawParticipantActionProps {
  /**
   * Current Journey Boarding projection.
   */
  boarding: JourneyBoarding;

  /**
   * Authenticated passenger's boarding participant.
   *
   * The parent action coordinator resolves the participant belonging to the
   * authenticated member before rendering this action.
   */
  participant: JourneyBoardingParticipant;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function WithdrawParticipantAction({
  boarding,
  participant,
}: WithdrawParticipantActionProps) {
  const [isConfirmationOpen, setIsConfirmationOpen] =
    useState(false);

  const withdrawParticipant =
    useWithdrawParticipant();

  // ---------------------------------------------------------------------------
  // Client-visible applicability
  // ---------------------------------------------------------------------------
  //
  // Only an EXPECTED participant can currently withdraw from boarding.
  //
  // This is presentation-level filtering only. The backend aggregate remains
  // authoritative and may reject a stale or otherwise invalid operation.
  // ---------------------------------------------------------------------------

  if (
    participant.status !==
    JourneyBoardingParticipantStatus.EXPECTED
  ) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleConfirm = () => {
    withdrawParticipant.mutate(
      {
        params: {
          journeyBoardingPublicId: boarding.publicId,
          participantPublicId: participant.publicId,
        },
        request: {
          withdrawnAt: new Date().toISOString(),
        },
      },
      {
        onSuccess: () => {
          setIsConfirmationOpen(false);
        },
      },
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (withdrawParticipant.isPending) {
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
        variant="outline"
        size="md"
        onClick={() => setIsConfirmationOpen(true)}
        disabled={withdrawParticipant.isPending}
      >
        Withdraw from boarding
      </Button>

      <Dialog
        open={isConfirmationOpen}
        onOpenChange={handleOpenChange}
        title="Withdraw from boarding?"
        description="This will record that you are no longer participating in this boarding."
        footer={
          <>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => handleOpenChange(false)}
              disabled={withdrawParticipant.isPending}
            >
              Keep my place
            </Button>

            <Button
              type="button"
              variant="danger"
              size="md"
              loading={withdrawParticipant.isPending}
              disabled={withdrawParticipant.isPending}
              onClick={handleConfirm}
            >
              {withdrawParticipant.isPending
                ? 'Withdrawing…'
                : 'Confirm withdrawal'}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-[var(--foreground-secondary)]">
            You can use this action to withdraw from the current
            boarding. This changes your participant status and will
            be recorded in the boarding activity.
          </p>

          {withdrawParticipant.isError && (
            <p
              role="alert"
              className="text-sm text-[var(--danger)]"
            >
              {withdrawParticipant.error instanceof Error
                ? withdrawParticipant.error.message
                : 'Unable to withdraw from boarding. Please try again.'}
            </p>
          )}
        </div>
      </Dialog>
    </>
  );
}