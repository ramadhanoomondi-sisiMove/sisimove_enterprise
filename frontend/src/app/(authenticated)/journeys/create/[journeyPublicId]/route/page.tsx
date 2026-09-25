// src/app/(authenticated)/journeys/create/[journeyPublicId]/route/page.tsx

'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Creation — Route Step
// -----------------------------------------------------------------------------
//
// This page is the workflow/application boundary for the Journey route step.
//
// It coordinates:
//
//   JourneyCorridor
//       attach/configure
//
//   JourneyWaypoint
//       add
//       remove
//
// The Journey aggregate remains the authoritative domain boundary.
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// Waypoints intentionally use ADD + REMOVE semantics only.
//
// Existing persisted waypoints are never edited through this page.
// New waypoint form rows represent new JourneyWaypoint instances.
//
// The page does NOT:
// - create public IDs;
// - construct domain entities;
// - call HTTP adapters directly;
// - implement aggregate invariants;
// - update persisted waypoints;
// - replace the Journey corridor through client-side domain logic;
// - manipulate React Query caches directly.
//
// -----------------------------------------------------------------------------

import {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  useParams,
  useRouter,
} from 'next/navigation';

import { Button } from '@/components/ui';

import {
  JourneyRouteStep,
  type JourneyCorridorFormSubmitValue,
  type JourneyWaypointsFormSubmitValue,
} from '@/components/journeys/creation/route';

import {
  useJourneyCorridor,
  useJourneyWaypoints,
} from '@/features/journey/hooks/queries';

import {
  useAddJourneyWaypoint,
  useAttachJourneyCorridor,
  useRemoveJourneyWaypoint,
} from '@/features/journey/hooks/mutations';

import { AUTHENTICATED_ROUTES } from '@/foundation/routing';

// ============================================================================
// Helpers
// ============================================================================

/**
 * Determines whether a complete corridor form value represents the same
 * configuration as the persisted Journey corridor.
 *
 * This is a workflow-level comparison only.
 *
 * It is NOT a replacement for Journey aggregate/domain validation.
 */
function isSameCorridor(
  current: JourneyCorridorFormSubmitValue,
  persisted: JourneyCorridorFormSubmitValue,
): boolean {
  return (
    current.originName === persisted.originName &&
    current.originLatitude === persisted.originLatitude &&
    current.originLongitude === persisted.originLongitude &&
    current.destinationName === persisted.destinationName &&
    current.destinationLatitude ===
      persisted.destinationLatitude &&
    current.destinationLongitude ===
      persisted.destinationLongitude
  );
}

// ============================================================================
// Page
// ============================================================================

export default function JourneyRoutePage() {
  // ---------------------------------------------------------------------------
  // Route identity
  // ---------------------------------------------------------------------------

  const params = useParams<{ journeyPublicId: string }>();
  const router = useRouter();

  const journeyPublicId = params.journeyPublicId;

  // ---------------------------------------------------------------------------
  // Journey-owned component queries
  // ---------------------------------------------------------------------------
  //
  // These hooks are the frontend query boundary.
  //
  // The page does not construct HTTP URLs or call fetch().
  // ---------------------------------------------------------------------------

  const corridorQuery = useJourneyCorridor(journeyPublicId);

  const waypointsQuery = useJourneyWaypoints(journeyPublicId);

  // ---------------------------------------------------------------------------
  // Journey-owned component mutations
  // ---------------------------------------------------------------------------

  const attachCorridor = useAttachJourneyCorridor();

  const addWaypoint = useAddJourneyWaypoint();

  const removeWaypoint = useRemoveJourneyWaypoint();

  // ---------------------------------------------------------------------------
  // Workflow state
  // ---------------------------------------------------------------------------

  /**
   * Partial corridor state exists only while the user is editing fields.
   *
   * It is NEVER passed to the persistence operation.
   *
   * The complete JourneyCorridorFormSubmitValue is received through
   * onCorridorSubmit.
   */
  const [corridorDraft, setCorridorDraft] =
    useState<Partial<JourneyCorridorFormSubmitValue>>();

  /**
   * New waypoint rows entered during this route step.
   *
   * This collection contains ONLY unsaved waypoint configurations.
   *
   * Persisted waypoints are loaded separately from useJourneyWaypoints().
   */
  const [newWaypoints, setNewWaypoints] = useState<
    readonly JourneyWaypointsFormSubmitValue[]
  >([]);

  const [saveError, setSaveError] =
    useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Persisted corridor
  // ---------------------------------------------------------------------------

  const persistedCorridor = useMemo<
    JourneyCorridorFormSubmitValue | undefined
  >(() => {
    const corridor = corridorQuery.data;

    if (!corridor) {
      return undefined;
    }

    return {
      originName: corridor.originName,
      originLatitude: corridor.originLatitude,
      originLongitude: corridor.originLongitude,
      destinationName: corridor.destinationName,
      destinationLatitude: corridor.destinationLatitude,
      destinationLongitude: corridor.destinationLongitude,
    };
  }, [corridorQuery.data]);

  // ---------------------------------------------------------------------------
  // Corridor presentation value
  // ---------------------------------------------------------------------------
  //
  // The form accepts Partial because it is allowed to represent an
  // incomplete in-progress edit.
  //
  // Persistence still requires the complete submit contract.
  // ---------------------------------------------------------------------------

  const corridorValue = useMemo<
    Partial<JourneyCorridorFormSubmitValue> | undefined
  >(() => {
    if (corridorDraft) {
      return corridorDraft;
    }

    return persistedCorridor;
  }, [corridorDraft, persistedCorridor]);

  // ---------------------------------------------------------------------------
  // Persisted waypoints
  // ---------------------------------------------------------------------------

  const persistedWaypoints = useMemo(
    () => waypointsQuery.data ?? [],
    [waypointsQuery.data],
  );

  // ---------------------------------------------------------------------------
  // Corridor change
  // ---------------------------------------------------------------------------

  const handleCorridorChange = useCallback(
    (value: Partial<JourneyCorridorFormSubmitValue>) => {
      setCorridorDraft((current) => ({
        ...current,
        ...value,
      }));

      setSaveError(null);
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // New waypoint change
  // ---------------------------------------------------------------------------

  const handleNewWaypointsChange = useCallback(
    (value: readonly JourneyWaypointsFormSubmitValue[]) => {
      setNewWaypoints(value);
      setSaveError(null);
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Persist route
  // ---------------------------------------------------------------------------
  //
  // The complete corridor is supplied by JourneyCorridorForm through
  // onCorridorSubmit.
  //
  // Persisting the route follows:
  //
  //   existing corridor unchanged
  //       → do nothing
  //
  //   new/changed corridor
  //       → attach/configure through Journey aggregate
  //
  //   new waypoint
  //       → add through Journey aggregate
  //
  // Existing waypoints are never updated here.
  // ---------------------------------------------------------------------------

  const handleRouteSubmit = useCallback(
    async (
      corridor: JourneyCorridorFormSubmitValue,
    ) => {
      setSaveError(null);

      try {
        // ---------------------------------------------------------------------
        // 1. Configure the corridor only when necessary.
        // ---------------------------------------------------------------------
        //
        // This prevents an unnecessary attach operation when the route is
        // already configured.
        //
        // It is particularly important when persisted waypoints exist because
        // JourneyAggregate.attachCorridor() intentionally refuses corridor
        // replacement while waypoints are present.
        // ---------------------------------------------------------------------

        const corridorNeedsPersistence =
          !persistedCorridor ||
          !isSameCorridor(corridor, persistedCorridor);

        if (corridorNeedsPersistence) {
          await attachCorridor.mutateAsync({
            journeyPublicId,

            originName: corridor.originName,
            originLatitude: corridor.originLatitude,
            originLongitude: corridor.originLongitude,

            destinationName: corridor.destinationName,
            destinationLatitude: corridor.destinationLatitude,
            destinationLongitude: corridor.destinationLongitude,
          });
        }

        // ---------------------------------------------------------------------
        // 2. Add new waypoints.
        // ---------------------------------------------------------------------
        //
        // Existing persisted waypoints remain untouched.
        //
        // The backend creates the JourneyWaypoint public ID and the aggregate
        // decides whether the waypoint can be added.
        // ---------------------------------------------------------------------

        for (const waypoint of newWaypoints) {
          await addWaypoint.mutateAsync({
            journeyPublicId,

            type: waypoint.type,
            sequence: waypoint.sequence,
            name: waypoint.name,
            latitude: waypoint.latitude,
            longitude: waypoint.longitude,
            pickupAllowed: waypoint.pickupAllowed,
            dropoffAllowed: waypoint.dropoffAllowed,
          });
        }

        // ---------------------------------------------------------------------
        // 3. Continue to schedule.
        // ---------------------------------------------------------------------

        router.push(
          AUTHENTICATED_ROUTES.JOURNEY_CREATE_SCHEDULE(
            journeyPublicId,
          ),
        );
      } catch (error) {
        setSaveError(
          error instanceof Error
            ? error.message
            : 'Unable to save the journey route.',
        );
      }
    },
    [
      addWaypoint,
      attachCorridor,
      journeyPublicId,
      newWaypoints,
      persistedCorridor,
      router,
    ],
  );

  // ---------------------------------------------------------------------------
  // Remove persisted waypoint
  // ---------------------------------------------------------------------------

  const handleRemoveWaypoint = useCallback(
    async (waypointPublicId: string) => {
      setSaveError(null);

      try {
        await removeWaypoint.mutateAsync({
          journeyPublicId,
          waypointPublicId,
        });
      } catch (error) {
        setSaveError(
          error instanceof Error
            ? error.message
            : 'Unable to remove the waypoint.',
        );
      }
    },
    [
      journeyPublicId,
      removeWaypoint,
    ],
  );

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  const isLoading =
    corridorQuery.isLoading ||
    waypointsQuery.isLoading;

  const isSaving =
    attachCorridor.isPending ||
    addWaypoint.isPending ||
    removeWaypoint.isPending;

  // ---------------------------------------------------------------------------
  // Query error
  // ---------------------------------------------------------------------------

  const queryError =
    corridorQuery.error ??
    waypointsQuery.error;

  if (isLoading) {
    return (
      <main className="min-h-[60vh]">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-center px-4 py-12 sm:px-6">
          <p className="text-sm text-muted-foreground">
            Loading your journey route…
          </p>
        </div>
      </main>
    );
  }

  if (queryError) {
    return (
      <main className="min-h-[60vh]">
        <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
            <h1 className="text-lg font-semibold text-foreground">
              Unable to load your route
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              {queryError instanceof Error
                ? queryError.message
                : 'Something went wrong while loading the journey route.'}
            </p>

            <div className="mt-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  void corridorQuery.refetch();
                  void waypointsQuery.refetch();
                }}
              >
                Try again
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <main className="min-h-[60vh]">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        {/* ----------------------------------------------------------------- */}
        {/* Heading                                                           */}
        {/* ----------------------------------------------------------------- */}

        <div className="mb-6">
          <p className="text-sm font-medium text-brand">
            Journey creation · Route
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            Where are you going?
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Set your origin and destination, then add any stops where
            passengers can be picked up or dropped off.
          </p>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Persisted waypoints                                               */}
        {/* ----------------------------------------------------------------- */}
        {/*
          Persisted waypoints are intentionally outside JourneyWaypointsForm.

          They already have Journey-owned public identities and therefore
          support REMOVE only.
        */}

        {persistedWaypoints.length > 0 ? (
          <section
            aria-labelledby="existing-waypoints-heading"
            className="mb-6 rounded-xl border border-border bg-background p-5"
          >
            <div className="mb-4">
              <h2
                id="existing-waypoints-heading"
                className="text-base font-semibold text-foreground"
              >
                Current stops
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Existing stops can be removed. New stops can be added below.
              </p>
            </div>

            <div className="space-y-3">
              {persistedWaypoints.map((waypoint) => (
                <div
                  key={waypoint.publicId}
                  className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/20 p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {waypoint.name}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Stop {waypoint.sequence} · {waypoint.type}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {waypoint.pickupAllowed
                        ? 'Pickup'
                        : 'No pickup'}{' '}
                      ·{' '}
                      {waypoint.dropoffAllowed
                        ? 'Drop-off'
                        : 'No drop-off'}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSaving}
                    onClick={() => {
                      void handleRemoveWaypoint(
                        waypoint.publicId,
                      );
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* ----------------------------------------------------------------- */}
        {/* Save error                                                        */}
        {/* ----------------------------------------------------------------- */}

        {saveError ? (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 p-4"
          >
            <p className="text-sm font-medium text-foreground">
              We could not save the route.
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {saveError}
            </p>
          </div>
        ) : null}

        {/* ----------------------------------------------------------------- */}
        {/* Route forms                                                       */}
        {/* ----------------------------------------------------------------- */}

        <JourneyRouteStep
          key={journeyPublicId}
          corridor={corridorValue}
          /*
           * The waypoint form represents NEW waypoint additions only.
           *
           * Persisted waypoints are rendered separately above.
           */
          waypoints={newWaypoints}
          disabled={isSaving}
          onCorridorChange={handleCorridorChange}
          onCorridorSubmit={handleRouteSubmit}
          onWaypointsChange={handleNewWaypointsChange}
        />

        {/* ----------------------------------------------------------------- */}
        {/* Workflow navigation                                               */}
        {/* ----------------------------------------------------------------- */}

        <div className="mt-6 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={isSaving}
            onClick={() => {
              router.push(
                AUTHENTICATED_ROUTES.JOURNEY_CREATE(
                  journeyPublicId,
                ),
              );
            }}
          >
            Back
          </Button>

          <Button
            type="button"
            disabled={isSaving}
            onClick={() => {
              const form = document.getElementById(
                'journey-corridor-form',
              );

              if (!(form instanceof HTMLFormElement)) {
                setSaveError(
                  'The route form is unavailable. Please try again.',
                );
                return;
              }

              form.requestSubmit();
            }}
          >
            {isSaving
              ? 'Saving route…'
              : 'Save and continue'}
          </Button>
        </div>
      </div>
    </main>
  );
}