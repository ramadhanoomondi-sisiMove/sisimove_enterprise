// -----------------------------------------------------------------------------
// sisiMove — Mark Passenger No-Show Action
// -----------------------------------------------------------------------------
//
// Presents the provider operation for marking a passenger participant as a
// no-show.
//
// Responsibilities:
// - Present the operation when the participant is currently expected.
// - Require explicit confirmation before the consequential transition.
// - Build the variables expected by useMarkPassengerNoShow.
// - Invoke the mutation.
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

import { useMarkPassengerNoShow } from '@/features/journey-boarding/hooks';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface MarkPassengerNoShowActionProps {
  /**
   * Current Journey Boarding projection.
   */
  boarding: JourneyBoarding;

  /**
   * Passenger participant that may be marked as a no-show.
   */
  participant: JourneyBoardingParticipant;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MarkPassengerNoShowAction({
  boarding,
  participant,
}: MarkPassengerNoShowActionProps) {
  const [isConfirmationOpen, setIsConfirmationOpen] =
    useState(false);

  const markPassengerNoShow =
    useMarkPassengerNoShow();

  // ---------------------------------------------------------------------------
  // Client-visible applicability
  // ---------------------------------------------------------------------------
  //
  // Only an EXPECTED passenger can be marked as a no-show from the current
  // participant projection.
  //
  // This is presentation-level filtering only. The backend aggregate remains
  // authoritative.
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
    markPassengerNoShow.mutate(
      {
        params: {
          journeyBoardingPublicId: boarding.publicId,
          participantPublicId: participant.publicId,
        },
        request: {
          noShowAt: new Date().toISOString(),
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
    if (markPassengerNoShow.isPending) {
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
        disabled={markPassengerNoShow.isPending}
      >
        Mark no-show
      </Button>

      <Dialog
        open={isConfirmationOpen}
        onOpenChange={handleOpenChange}
        title="Mark passenger as no-show?"
        description="This will record that the passenger did not board the journey."
        footer={
          <>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => handleOpenChange(false)}
              disabled={markPassengerNoShow.isPending}
            >
              Keep passenger
            </Button>

            <Button
              type="button"
              variant="danger"
              size="md"
              loading={markPassengerNoShow.isPending}
              disabled={markPassengerNoShow.isPending}
              onClick={handleConfirm}
            >
              {markPassengerNoShow.isPending
                ? 'Marking no-show…'
                : 'Confirm no-show'}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-[var(--foreground-secondary)]">
            This action changes the passenger&apos;s boarding
            status. Confirm only if the passenger has not boarded.
          </p>

          {markPassengerNoShow.isError && (
            <p
              role="alert"
              className="text-sm text-[var(--danger)]"
            >
              {markPassengerNoShow.error instanceof Error
                ? markPassengerNoShow.error.message
                : 'Unable to mark the passenger as a no-show. Please try again.'}
            </p>
          )}
        </div>
      </Dialog>
    </>
  );
}