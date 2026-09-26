// -----------------------------------------------------------------------------
// sisiMove — Remove Participant Action
// -----------------------------------------------------------------------------
//
// Presents the provider operation for removing a participant from Journey
// Boarding.
//
// Responsibilities:
// - Present the removal operation when the participant is eligible from the
//   current client projection.
// - Require explicit confirmation before the consequential transition.
// - Build the variables expected by useRemoveParticipant.
// - Invoke the removal mutation.
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

import { useRemoveParticipant } from '@/features/journey-boarding/hooks';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface RemoveParticipantActionProps {
  /**
   * Current Journey Boarding projection.
   */
  boarding: JourneyBoarding;

  /**
   * Passenger participant to remove.
   *
   * The parent action coordinator supplies the participant explicitly so this
   * action remains focused on one participant transition.
   */
  participant: JourneyBoardingParticipant;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function RemoveParticipantAction({
  boarding,
  participant,
}: RemoveParticipantActionProps) {
  const [isConfirmationOpen, setIsConfirmationOpen] =
    useState(false);

  const removeParticipant = useRemoveParticipant();

  // ---------------------------------------------------------------------------
  // Client-visible applicability
  // ---------------------------------------------------------------------------
  //
  // A participant can only be removed from the provider's action surface while
  // they are still EXPECTED.
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
    removeParticipant.mutate(
      {
        params: {
          journeyBoardingPublicId: boarding.publicId,
          participantPublicId: participant.publicId,
        },
        request: {
          removedAt: new Date().toISOString(),
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
    if (removeParticipant.isPending) {
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
        onClick={() => setIsConfirmationOpen(true)}
        disabled={removeParticipant.isPending}
      >
        Remove participant
      </Button>

      <Dialog
        open={isConfirmationOpen}
        onOpenChange={handleOpenChange}
        title="Remove participant?"
        description="This will record the participant as removed from this boarding."
        footer={
          <>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => handleOpenChange(false)}
              disabled={removeParticipant.isPending}
            >
              Keep participant
            </Button>

            <Button
              type="button"
              variant="danger"
              size="md"
              loading={removeParticipant.isPending}
              disabled={removeParticipant.isPending}
              onClick={handleConfirm}
            >
              {removeParticipant.isPending
                ? 'Removing…'
                : 'Confirm removal'}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-[var(--foreground-secondary)]">
            Removing a participant changes their boarding status and
            records the action in the boarding activity.
          </p>

          {removeParticipant.isError && (
            <p
              role="alert"
              className="text-sm text-[var(--danger)]"
            >
              {removeParticipant.error instanceof Error
                ? removeParticipant.error.message
                : 'Unable to remove the participant. Please try again.'}
            </p>
          )}
        </div>
      </Dialog>
    </>
  );
}