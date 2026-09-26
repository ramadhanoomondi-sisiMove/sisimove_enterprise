// -----------------------------------------------------------------------------
// sisiMove — Board Passenger Action
// -----------------------------------------------------------------------------
//
// Presents the provider action for marking a passenger as boarded.
//
// Responsibilities:
// - Present the operation when the passenger is currently expected.
// - Build the variables expected by useBoardPassenger.
// - Invoke the passenger boarding mutation.
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

import { Button } from '@/components/ui';

import {
  JourneyBoardingParticipantStatus,
  type JourneyBoarding,
  type JourneyBoardingParticipant,
} from '@/features/journey-boarding/models';

import { useBoardPassenger } from '@/features/journey-boarding/hooks';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface BoardPassengerActionProps {
  /**
   * Current Journey Boarding projection.
   */
  boarding: JourneyBoarding;

  /**
   * Passenger participant to board.
   *
   * The parent action coordinator supplies the participant explicitly so this
   * action remains focused on one participant transition.
   */
  participant: JourneyBoardingParticipant;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function BoardPassengerAction({
  boarding,
  participant,
}: BoardPassengerActionProps) {
  const boardPassenger = useBoardPassenger();

  // ---------------------------------------------------------------------------
  // Client-visible applicability
  // ---------------------------------------------------------------------------
  //
  // Only an EXPECTED passenger has a boarding operation available.
  //
  // This is a presentation-level optimization, not a replacement for backend
  // aggregate validation.
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

  const handleBoardPassenger = () => {
    boardPassenger.mutate({
      params: {
        journeyBoardingPublicId: boarding.publicId,
        participantPublicId: participant.publicId,
      },
      request: {
        boardedAt: new Date().toISOString(),
      },
    });
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="primary"
        size="md"
        loading={boardPassenger.isPending}
        disabled={boardPassenger.isPending}
        onClick={handleBoardPassenger}
      >
        {boardPassenger.isPending
          ? 'Boarding…'
          : 'Board passenger'}
      </Button>

      {boardPassenger.isError && (
        <p
          role="alert"
          className="text-sm text-[var(--danger)]"
        >
          {boardPassenger.error instanceof Error
            ? boardPassenger.error.message
            : 'Unable to board the passenger. Please try again.'}
        </p>
      )}
    </div>
  );
}