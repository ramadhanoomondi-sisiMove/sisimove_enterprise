// -----------------------------------------------------------------------------
// sisiMove — Journey Review Page
// -----------------------------------------------------------------------------
//
// Final review step in the Journey creation workflow.
//
// Responsibilities:
// - Load the persisted Journey configuration.
// - Present the complete Journey configuration.
// - Allow navigation back to individual creation steps.
// - Delegate final publication to the existing Journey publication contract.
//
// Architectural rules:
// - The Journey backend is the source of truth.
// - No catalogue data is introduced here.
// - The review does not reconstruct Journey state from browser-local state.
// - The review does not calculate fees, commission, or provider income.
// - The backend remains authoritative over publication validation.
//
// Workflow:
//
// Route
//   ↓
// Schedule
//   ↓
// Vehicle
//   ↓
// Seats
//   ↓
// Pricing
//   ↓
// Preferences
//   ↓
// Review
//
// IMPORTANT:
// The exact existing publish mutation/API must be used here.
// Do not invent a publish endpoint or mutation signature if it is not already
// present in the Journey feature.
//
// -----------------------------------------------------------------------------

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  JourneyReview,
  type JourneyReviewCapacity,
  type JourneyReviewPricing,
  type JourneyReviewPreferences,
  type JourneyReviewRoute,
  type JourneyReviewSchedule,
  type JourneyReviewVehicle,
} from '@/components/journeys/review';

import { useJourney } from '@/features/journey/hooks/use-journey';

import { normalizeError } from '@/foundation/errors';
import { AUTHENTICATED_ROUTES } from '@/foundation/routing';

// =============================================================================
// Route Props
// =============================================================================

interface JourneyReviewPageProps {
  params: Promise<{
    journeyPublicId: string;
  }>;
}

// =============================================================================
// Page
// =============================================================================

export default function JourneyReviewPage({
  params,
}: JourneyReviewPageProps) {
  const [journeyPublicId, setJourneyPublicId] = useState<string | null>(
    null,
  );

  // ---------------------------------------------------------------------------
  // Resolve the dynamic route parameter.
  // ---------------------------------------------------------------------------
  //
  // This follows the existing Journey creation step pattern used by the
  // working Route and Seats pages.
  //

  void params.then(({ journeyPublicId: publicId }) => {
    setJourneyPublicId(
      (current) => current ?? publicId,
    );
  });

  if (!journeyPublicId) {
    return null;
  }

  return (
    <JourneyReviewStep
      journeyPublicId={journeyPublicId}
    />
  );
}

// =============================================================================
// Review Step
// =============================================================================

interface JourneyReviewStepProps {
  journeyPublicId: string;
}

function JourneyReviewStep({
  journeyPublicId,
}: JourneyReviewStepProps) {
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // Load the persisted Journey.
  // ---------------------------------------------------------------------------
  //
  // Review intentionally reads the server-side Journey rather than maintaining
  // a second local workflow state.
  //

  const {
    data: journey,
    isLoading,
    error: queryError,
    refetch,
  } = useJourney(journeyPublicId);

  // ---------------------------------------------------------------------------
  // Publication state
  // ---------------------------------------------------------------------------

  const [
    publicationError,
    setPublicationError,
  ] = useState<string | null>(null);

  const [
    isPublishing,
    setIsPublishing,
  ] = useState(false);

  // ---------------------------------------------------------------------------
  // Navigation helpers
  // ---------------------------------------------------------------------------

  function goToRoute(): void {
    router.push(
      AUTHENTICATED_ROUTES.JOURNEY_CREATE_ROUTE(
        journeyPublicId,
      ),
    );
  }

  function goToSchedule(): void {
    router.push(
      AUTHENTICATED_ROUTES.JOURNEY_CREATE_SCHEDULE(
        journeyPublicId,
      ),
    );
  }

  function goToVehicle(): void {
    router.push(
      AUTHENTICATED_ROUTES.JOURNEY_CREATE_VEHICLE(
        journeyPublicId,
      ),
    );
  }

  function goToCapacity(): void {
    router.push(
      AUTHENTICATED_ROUTES.JOURNEY_CREATE_SEATS(
        journeyPublicId,
      ),
    );
  }

  function goToPricing(): void {
    router.push(
      AUTHENTICATED_ROUTES.JOURNEY_CREATE_PRICING(
        journeyPublicId,
      ),
    );
  }

  function goToPreferences(): void {
    router.push(
      AUTHENTICATED_ROUTES.JOURNEY_CREATE_PREFERENCES(
        journeyPublicId,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Final confirmation
  // ---------------------------------------------------------------------------
  //
  // Do not implement or invent publication behavior until the existing Journey
  // publication API/hook contract is available.
  //
  // This guard prevents the review screen from pretending that navigation is
  // equivalent to publication.
  //

  async function handleConfirm(): Promise<void> {
    if (isPublishing) {
      return;
    }

    setPublicationError(
      'Journey publication is not connected to this review step yet.',
    );
  }

  // ---------------------------------------------------------------------------
  // Query error
  // ---------------------------------------------------------------------------

  if (queryError) {
    const normalizedError =
      normalizeError(queryError);

    return (
      <main className="min-h-[60vh] px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-2xl">
          <section
            aria-labelledby="journey-review-error-title"
            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 sm:p-6"
          >
            <p className="text-sm font-medium text-[var(--brand)]">
              Journey creation
            </p>

            <h1
              id="journey-review-error-title"
              className="mt-1 text-lg font-semibold text-[var(--foreground)]"
            >
              Review journey
            </h1>

            <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
              We could not load the journey details for review.
            </p>

            <p
              role="alert"
              className="mt-4 rounded-xl bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]"
            >
              {normalizedError.message}
            </p>

            <button
              type="button"
              onClick={() => {
                void refetch();
              }}
              className="mt-5 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--background-subtle)]"
            >
              Try again
            </button>
          </section>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (isLoading || !journey) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Map persisted Journey children into the presentation model.
  // ---------------------------------------------------------------------------

  const route: JourneyReviewRoute | null =
    journey.corridor
      ? {
          originName:
            journey.corridor.originName,
          destinationName:
            journey.corridor.destinationName,
          waypointNames:
            journey.corridor.waypoints
              .slice()
              .sort(
                (a, b) =>
                  a.sequence - b.sequence,
              )
              .map(
                (waypoint) =>
                  waypoint.name,
              ),
        }
      : null;

  const schedule: JourneyReviewSchedule | null =
    journey.schedule
      ? {
          departureAt:
            journey.schedule.departureAt,
          arrivalAt:
            journey.schedule.arrivalAt,
          timezone:
            journey.schedule.timezone,
        }
      : null;

  const vehicle: JourneyReviewVehicle | null =
    journey.vehicle
      ? {
          make:
            journey.vehicle.make,
          model:
            journey.vehicle.model,
          year:
            journey.vehicle.year,
          color:
            journey.vehicle.color,
          registration:
            journey.vehicle.registration,
        }
      : null;

  const capacity: JourneyReviewCapacity | null =
    journey.capacity
      ? {
          totalSeats:
            journey.capacity.totalSeats,
        }
      : null;

  const pricing: JourneyReviewPricing | null =
    journey.pricing
      ? {
          amount:
            journey.pricing.amount,
          currency:
            journey.pricing.currency,
        }
      : null;

  const preferences: JourneyReviewPreferences | null =
    journey.preferences
      ? {
          smoking:
            journey.preferences.smoking,
          pets:
            journey.preferences.pets,
          luggage:
            journey.preferences.luggage,
          conversation:
            journey.preferences.conversation,
          music:
            journey.preferences.music,
        }
      : null;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <main className="min-h-[60vh] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-6">
          <p className="text-sm font-medium text-[var(--brand)]">
            Journey creation
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            Review
          </h1>

          <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
            Check all your journey details before publishing.
          </p>
        </header>

        <JourneyReview
          route={route}
          schedule={schedule}
          vehicle={vehicle}
          capacity={capacity}
          pricing={pricing}
          preferences={preferences}
          onEditRoute={goToRoute}
          onEditSchedule={goToSchedule}
          onEditVehicle={goToVehicle}
          onEditCapacity={goToCapacity}
          onEditPricing={goToPricing}
          onEditPreferences={goToPreferences}
          onConfirm={handleConfirm}
          isLoading={isPublishing}
          error={publicationError}
        />
      </div>
    </main>
  );
}