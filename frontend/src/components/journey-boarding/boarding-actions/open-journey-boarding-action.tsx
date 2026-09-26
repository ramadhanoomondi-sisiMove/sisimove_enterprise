// -----------------------------------------------------------------------------
// sisiMove — Open Journey Boarding Action
// -----------------------------------------------------------------------------
//
// Presents the provider action for opening Journey Boarding.
//
// Responsibilities:
// - Present the operation when the current boarding projection is NOT_STARTED.
// - Build the variables expected by useOpenJourneyBoarding.
// - Invoke the mutation hook.
// - Present mutation progress and failure feedback.
//
// Non-responsibilities:
// - Does not perform HTTP requests.
// - Does not own lifecycle business rules.
// - Does not perform authorization.
// - Does not mutate the JourneyBoarding model locally.
//
// The backend JourneyBoardingAggregate remains authoritative for the lifecycle
// transition.
// -----------------------------------------------------------------------------

import { Button } from '@/components/ui';

import {
  JourneyBoardingStatus,
  type JourneyBoarding,
} from '@/features/journey-boarding/models';

import { useOpenJourneyBoarding } from '@/features/journey-boarding/hooks';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface OpenJourneyBoardingActionProps {
  /**
   * Current Journey Boarding projection.
   */
  boarding: JourneyBoarding;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function OpenJourneyBoardingAction({
  boarding,
}: OpenJourneyBoardingActionProps) {
  const openJourneyBoarding = useOpenJourneyBoarding();

  // ---------------------------------------------------------------------------
  // Client-visible applicability
  // ---------------------------------------------------------------------------
  //
  // A boarding that is already open, started, or cancelled has no "open"
  // action to present.
  //
  // This does not replace backend validation. The aggregate remains the
  // authority, particularly when the client projection is stale.
  // ---------------------------------------------------------------------------

  if (boarding.status !== JourneyBoardingStatus.NOT_STARTED) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleOpen = () => {
    openJourneyBoarding.mutate({
      params: {
        journeyBoardingPublicId: boarding.publicId,
      },
      request: {
        boardingStartedAt: new Date().toISOString(),
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
        loading={openJourneyBoarding.isPending}
        disabled={openJourneyBoarding.isPending}
        onClick={handleOpen}
      >
        {openJourneyBoarding.isPending
          ? 'Opening boarding…'
          : 'Open boarding'}
      </Button>

      {openJourneyBoarding.isError && (
        <p
          role="alert"
          className="text-sm text-[var(--danger)]"
        >
          {openJourneyBoarding.error instanceof Error
            ? openJourneyBoarding.error.message
            : 'Unable to open boarding. Please try again.'}
        </p>
      )}
    </div>
  );
}