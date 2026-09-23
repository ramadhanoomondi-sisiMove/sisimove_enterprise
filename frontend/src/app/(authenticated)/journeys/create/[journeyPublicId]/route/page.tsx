// -----------------------------------------------------------------------------
// sisiMove — Journey Creation — Route Step
// -----------------------------------------------------------------------------
//
// Route configuration step for an existing Journey draft.
//
// Route:
//
//   /authenticated/journeys/create/:journeyPublicId/route
//
// Responsibilities:
// - Load the Journey's persisted corridor.
// - Present the route form.
// - Persist route changes through the existing Journey APIs.
// - Navigate to the Schedule step after successful submission.
//
// Non-responsibilities:
// - No Journey creation.
// - No global corridor catalogue.
// - No workflow overview.
// - No route-step state outside the form.
// - No coordinate editing.
// - No publishing.
//
// Persistence model:
//
//   Journey
//      └── JourneyCorridor
//             └── JourneyWaypoint[]
//
// The Journey public ID comes exclusively from the route.
//
// -----------------------------------------------------------------------------

'use client';

import {
  useMemo,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';

import {
  JourneyRouteForm,
  type JourneyRouteFormValue,
} from '@/components/journeys/route';

import {
  addJourneyWaypoint,
  removeJourneyWaypoint,
} from '@/features/journey/api';

import {
  useJourneyRoute,
} from '@/features/journey/hooks/use-journey-route';

import {
  normalizeError,
} from '@/foundation/errors';

import {
  AUTHENTICATED_ROUTES,
} from '@/foundation/routing';

// =============================================================================
// Types
// =============================================================================

interface JourneyRoutePageProps {
  params: Promise<{
    journeyPublicId: string;
  }>;
}

// =============================================================================
// Page
// =============================================================================

export default function JourneyRoutePage({
  params,
}: JourneyRoutePageProps) {
  const [journeyPublicId, setJourneyPublicId] =
    useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // The Next.js App Router supplies params asynchronously in this application.
  //
  // The page itself remains responsible only for resolving the route parameter.
  // ---------------------------------------------------------------------------

  void params.then(({ journeyPublicId: publicId }) => {
    setJourneyPublicId(
      (current) =>
        current ?? publicId,
    );
  });

  if (!journeyPublicId) {
    return null;
  }

  return (
    <JourneyRouteStep
      journeyPublicId={journeyPublicId}
    />
  );
}

// =============================================================================
// Route step
// =============================================================================

interface JourneyRouteStepProps {
  journeyPublicId: string;
}

function JourneyRouteStep({
  journeyPublicId,
}: JourneyRouteStepProps) {
  const router = useRouter();

  const {
    data: corridor,
    isLoading,
    error: queryError,
    refetch,
  } = useJourneyRoute(
    journeyPublicId,
  );

  const [
    mutationError,
    setMutationError,
  ] = useState<string | null>(null);

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  // ---------------------------------------------------------------------------
  // The persisted corridor contains the Journey's currently attached
  // waypoints.
  // ---------------------------------------------------------------------------

  const selectedWaypointPublicIds =
    useMemo(
      () =>
        corridor?.waypoints.map(
          (waypoint) =>
            waypoint.publicId,
        ) ?? [],
      [corridor],
    );

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  async function handleSubmit(
    value: JourneyRouteFormValue,
  ): Promise<void> {
    if (
      !corridor ||
      isSaving
    ) {
      return;
    }

    setMutationError(null);
    setIsSaving(true);

    try {
      const persistedWaypointIds =
        new Set(
          corridor.waypoints.map(
            (waypoint) =>
              waypoint.publicId,
          ),
        );

      const submittedWaypointIds =
        new Set(
          value.waypointPublicIds,
        );

      // -----------------------------------------------------------------------
      // Add newly selected waypoints.
      // -----------------------------------------------------------------------

      const additions =
        value.waypointPublicIds.filter(
          (waypointPublicId) =>
            !persistedWaypointIds.has(
              waypointPublicId,
            ),
        );

      for (
        const waypointPublicId of additions
      ) {
        await addJourneyWaypoint(
          journeyPublicId,
          {
            waypointPublicId,
          },
        );
      }

      // -----------------------------------------------------------------------
      // Remove waypoints that are no longer selected.
      // -----------------------------------------------------------------------

      const removals =
        corridor.waypoints.filter(
          (waypoint) =>
            !submittedWaypointIds.has(
              waypoint.publicId,
            ),
        );

      for (
        const waypoint of removals
      ) {
        await removeJourneyWaypoint(
          journeyPublicId,
          waypoint.publicId,
        );
      }

      // -----------------------------------------------------------------------
      // Route is persisted. Continue to Schedule.
      // -----------------------------------------------------------------------

      router.push(
        AUTHENTICATED_ROUTES.JOURNEY_CREATE_SCHEDULE(
          journeyPublicId,
        ),
      );
    } catch (submitError: unknown) {
      const normalizedError =
        normalizeError(submitError);

      setMutationError(
        normalizedError.message,
      );
    } finally {
      setIsSaving(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Query failure
  // ---------------------------------------------------------------------------

  if (queryError) {
    const normalizedError =
      normalizeError(queryError);

    return (
      <main className="min-h-[60vh] px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto w-full max-w-2xl">
          <section
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
            aria-labelledby="journey-route-error-title"
          >
            <h1
              id="journey-route-error-title"
              className="text-xl font-semibold text-[var(--foreground)]"
            >
              Route
            </h1>

            <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
              We could not load the route for this journey.
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
              className="mt-5 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background-subtle)]"
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

  if (isLoading) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <main className="min-h-[60vh] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-6">
          <p className="text-sm font-medium text-[var(--brand)]">
            Journey creation
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            Route
          </h1>

          <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
            Choose the stops along your journey where passengers can
            meet you.
          </p>
        </header>

        <JourneyRouteForm
          corridor={corridor}
          selectedWaypointPublicIds={
            selectedWaypointPublicIds
          }
          onSubmit={handleSubmit}
          isLoading={isSaving}
          error={mutationError}
        />
      </div>
    </main>
  );
}

