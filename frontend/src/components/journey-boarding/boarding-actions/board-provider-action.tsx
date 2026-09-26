// -----------------------------------------------------------------------------
// sisiMove — Board Provider Action
// -----------------------------------------------------------------------------
//
// Presents the provider action for marking the provider as boarded.
//
// Responsibilities:
// - Present the operation when the provider participant is eligible from the
//   current client projection.
// - Build the variables expected by useBoardProvider.
// - Invoke the provider boarding mutation.
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

import { useBoardProvider } from '@/features/journey-boarding/hooks';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface BoardProviderActionProps {
  /**
   * Current Journey Boarding projection.
   */
  boarding: JourneyBoarding;

  /**
   * Provider participant belonging to this boarding.
   *
   * The parent action coordinator resolves this participant from the boarding
   * aggregate projection before rendering this component.
   */
  participant: JourneyBoardingParticipant;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function BoardProviderAction({
  boarding,
  participant,
}: BoardProviderActionProps) {
  const boardProvider = useBoardProvider();

  // ---------------------------------------------------------------------------
  // Client-visible applicability
  // ---------------------------------------------------------------------------
  //
  // A provider can only be boarded while their participant is EXPECTED.
  //
  // This is intentionally a presentation-level check. The backend aggregate
  // remains authoritative and can reject a stale projection or unauthorized
  // operation.
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

  const handleBoardProvider = () => {
    boardProvider.mutate({
      params: {
        journeyBoardingPublicId: boarding.publicId,
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
        loading={boardProvider.isPending}
        disabled={boardProvider.isPending}
        onClick={handleBoardProvider}
      >
        {boardProvider.isPending
          ? 'Marking you as boarded…'
          : 'I am boarded'}
      </Button>

      {boardProvider.isError && (
        <p
          role="alert"
          className="text-sm text-[var(--danger)]"
        >
          {boardProvider.error instanceof Error
            ? boardProvider.error.message
            : 'Unable to mark the provider as boarded. Please try again.'}
        </p>
      )}
    </div>
  );
}