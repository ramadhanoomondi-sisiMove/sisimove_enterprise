// -----------------------------------------------------------------------------
// sisiMove — Start Journey Action
// -----------------------------------------------------------------------------
//
// Presents the provider operation for starting the Journey.
//
// Responsibilities:
// - Present the start operation when the current lifecycle projection makes
//   the operation relevant.
// - Require explicit confirmation before starting the Journey.
// - Build the variables expected by useStartJourney.
// - Invoke the start mutation.
// - Present mutation progress and failure feedback.
//
// Non-responsibilities:
// - Does not determine whether every passenger must be boarded.
// - Does not determine whether the Journey may legally start.
// - Does not perform HTTP requests.
// - Does not own Journey Boarding lifecycle rules.
// - Does not mutate the JourneyBoarding model locally.
//
// The backend JourneyBoardingAggregate remains authoritative for whether the
// Journey can actually be started.
// -----------------------------------------------------------------------------

import { useState } from 'react';

import {
  Button,
  Dialog,
} from '@/components/ui';

import {
  JourneyBoardingStatus,
  type JourneyBoarding,
} from '@/features/journey-boarding/models';

import { useStartJourney } from '@/features/journey-boarding/hooks';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface StartJourneyActionProps {
  /**
   * Current Journey Boarding projection.
   */
  boarding: JourneyBoarding;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function StartJourneyAction({
  boarding,
}: StartJourneyActionProps) {
  const [isConfirmationOpen, setIsConfirmationOpen] =
    useState(false);

  const startJourney = useStartJourney();

  // ---------------------------------------------------------------------------
  // Client-visible applicability
  // ---------------------------------------------------------------------------
  //
  // Starting the Journey is meaningful while boarding is active.
  //
  // The backend aggregate remains authoritative. In particular, this component
  // intentionally does not infer requirements about outstanding passengers,
  // provider boarding, or any other aggregate invariant.
  // ---------------------------------------------------------------------------

  if (boarding.status !== JourneyBoardingStatus.BOARDING) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleConfirm = () => {
    startJourney.mutate(
      {
        params: {
          journeyBoardingPublicId: boarding.publicId,
        },
        request: {
          journeyStartedAt: new Date().toISOString(),
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
    if (startJourney.isPending) {
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
        variant="primary"
        size="md"
        onClick={() => setIsConfirmationOpen(true)}
        disabled={startJourney.isPending}
      >
        Start journey
      </Button>

      <Dialog
        open={isConfirmationOpen}
        onOpenChange={handleOpenChange}
        title="Start journey?"
        description="Confirm that you are ready to start this journey."
        footer={
          <>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => handleOpenChange(false)}
              disabled={startJourney.isPending}
            >
              Not yet
            </Button>

            <Button
              type="button"
              variant="primary"
              size="md"
              loading={startJourney.isPending}
              disabled={startJourney.isPending}
              onClick={handleConfirm}
            >
              {startJourney.isPending
                ? 'Starting journey…'
                : 'Confirm start'}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-[var(--foreground-secondary)]">
            Starting the journey will change the boarding lifecycle
            and record the journey start time.
          </p>

          {startJourney.isError && (
            <p
              role="alert"
              className="text-sm text-[var(--danger)]"
            >
              {startJourney.error instanceof Error
                ? startJourney.error.message
                : 'Unable to start the journey. Please try again.'}
            </p>
          )}
        </div>
      </Dialog>
    </>
  );
}