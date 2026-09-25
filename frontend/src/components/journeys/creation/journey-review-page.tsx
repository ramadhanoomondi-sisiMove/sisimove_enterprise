'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Review Page
// -----------------------------------------------------------------------------
//
// Feature-level orchestration for the final Journey creation/review step.
//
// Responsibilities:
// - Load the authenticated Journey management representation.
// - Supply composed Journey data to the presentation components.
// - Invoke the publish mutation when the user confirms publication.
//
// This component does not:
// - create the Journey;
// - attach Journey components;
// - reconstruct the Journey aggregate;
// - enforce Journey-domain invariants;
// - perform the DRAFT -> PUBLISHED transition itself.
//
// The backend Journey aggregate remains the authority for publication.
// -----------------------------------------------------------------------------

import {
  useJourney,
  usePublishJourney,
} from '@/features/journey/hooks';

import {
  JourneyReviewStep,
} from './review/journey-review-step';

import {
  JourneyReviewSummary,
} from './review/journey-review-summary';

export interface JourneyReviewPageProps {
  /**
   * Public identifier of the Journey being reviewed.
   */
  journeyPublicId: string;
}

export function JourneyReviewPage({
  journeyPublicId,
}: JourneyReviewPageProps) {
  // ---------------------------------------------------------------------------
  // Load Journey management representation
  // ---------------------------------------------------------------------------

  const journeyQuery = useJourney({
    journeyPublicId,
  });

  // ---------------------------------------------------------------------------
  // Publish command
  // ---------------------------------------------------------------------------

  const publishJourney = usePublishJourney();

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (journeyQuery.isLoading) {
    return (
      <div className="page-container">
        <section
          aria-labelledby="journey-review-loading-heading"
          className="surface p-6"
        >
          <h1
            id="journey-review-loading-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Review your Journey
          </h1>

          <p className="mt-2 text-sm leading-6 text-[var(--foreground-secondary)]">
            Loading your Journey details…
          </p>
        </section>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Load failure
  // ---------------------------------------------------------------------------

  if (journeyQuery.isError || !journeyQuery.data) {
    return (
      <div className="page-container">
        <section
          aria-labelledby="journey-review-error-heading"
          className="surface p-6"
        >
          <h1
            id="journey-review-error-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Journey unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-[var(--foreground-secondary)]">
            We could not load this Journey. Please try again.
          </p>
        </section>
      </div>
    );
  }

  const journey = journeyQuery.data;

  // ---------------------------------------------------------------------------
  // Publish
  // ---------------------------------------------------------------------------

  const handlePublish = async (): Promise<void> => {
    await publishJourney.mutateAsync({
      journeyPublicId,
    });
  };

  // ---------------------------------------------------------------------------
  // Review
  // ---------------------------------------------------------------------------

  return (
    <div className="page-container">
      <JourneyReviewStep
        disabled={publishJourney.isPending}
        loading={publishJourney.isPending}
        error={
          publishJourney.error instanceof Error
            ? publishJourney.error.message
            : undefined
        }
        onSubmit={handlePublish}
      >
        <JourneyReviewSummary
          journey={journey}
          corridor={journey.corridor}
          waypoints={journey.corridor?.waypoints ?? []}
          schedule={journey.schedule}
          vehicle={journey.vehicle}
          capacity={journey.capacity}
          pricing={journey.pricing}
          preferences={journey.preferences}
          assets={journey.assets}
        />
      </JourneyReviewStep>
    </div>
  );
}