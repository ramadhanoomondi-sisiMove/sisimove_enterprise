// -----------------------------------------------------------------------------
// sisiMove — Journey Route Form
// -----------------------------------------------------------------------------
//
// Route configuration form for a persisted Journey.
//
// Architectural rule:
// - A Journey owns its JourneyCorridor.
// - The corridor is therefore not presented as a frontend catalogue.
// - The form reads the JourneyCorridor supplied by the parent.
// - The provider does not edit corridor coordinates or create a new corridor
//   from this form.
// - Waypoints belong to the JourneyCorridor and are presented from the
//   persisted corridor model.
// - Backend/application validation remains authoritative.
//
// Persistence model:
//
//   Journey
//      └── JourneyCorridor
//             └── JourneyWaypoint[]
//
// The frontend representation follows the backend response contract:
//
//   JourneyResponse
//      └── corridor: JourneyCorridorResponse | null
//             └── waypoints: JourneyWaypointResponse[]
//
// Responsibilities:
// - Present the Journey's existing corridor.
// - Present the corridor's waypoints.
// - Capture the provider's waypoint selection.
// - Delegate the combined route selection to the parent.
//
// Non-responsibilities:
// - No API calls.
// - No catalogue fetching.
// - No router usage.
// - No persistence.
// - No corridor creation.
// - No geographic coordinate editing.
// - No backend business-rule enforcement.
//
// Backend write operations remain separate:
//
// - POST /journeys/:journeyPublicId/corridor
//     { corridorPublicId }
//
// - POST /journeys/:journeyPublicId/waypoints
//     { waypointPublicId }
//
// The form intentionally exposes one combined UI value:
//
//     {
//       corridorPublicId,
//       waypointPublicIds,
//     }
//
// The parent/application layer is responsible for translating that selection
// into the backend's separate attachment operations.
//
// IMPORTANT:
// The corridor itself is supplied by the parent. This component no longer
// invents a "controlled corridor catalogue" abstraction that is not represented
// by the Journey persistence/response contracts.
// -----------------------------------------------------------------------------

'use client';

import { useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import type { JourneyCorridor } from '@/features/journey/models/journey-corridor';

import { JourneyWaypointList } from './journey-waypoint-list';

// =============================================================================
// Types
// =============================================================================

/**
 * Combined route value emitted by the presentation form.
 *
 * The backend persists corridor and waypoint attachments through separate
 * operations. Keeping this as one UI value allows the parent to coordinate
 * those operations without coupling this presentation component to the API.
 */
export interface JourneyRouteFormValue {
  /**
   * Public identifier of the Journey's corridor.
   */
  corridorPublicId: string;

  /**
   * Public identifiers of the selected waypoints.
   */
  waypointPublicIds: readonly string[];
}

export interface JourneyRouteFormProps {
  /**
   * The corridor currently associated with the Journey.
   *
   * This comes from the Journey response contract:
   *
   *     journey.corridor
   *
   * A null value means the Journey currently has no corridor attached.
   */
  corridor: JourneyCorridor | null;

  /**
   * Existing waypoint selection.
   *
   * This allows the form to be rendered with the Journey's current route
   * configuration when the provider resumes or edits the workflow.
   */
  selectedWaypointPublicIds?: readonly string[];

  /**
   * Called after the provider submits the route configuration.
   */
  onSubmit: (
    value: JourneyRouteFormValue,
  ) => void | Promise<void>;

  /**
   * Indicates that the parent is currently persisting the selection.
   */
  isLoading?: boolean;

  /**
   * Optional error supplied by the parent.
   */
  error?: string | null;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyRouteForm({
  corridor,
  selectedWaypointPublicIds = [],
  onSubmit,
  isLoading = false,
  error = null,
}: JourneyRouteFormProps) {
  // ---------------------------------------------------------------------------
  // Local waypoint selection state
  // ---------------------------------------------------------------------------
  //
  // The corridor itself is not editable here. It belongs to the Journey and is
  // supplied by the parent.
  //
  // Only the provider's waypoint selection is interactive.
  // ---------------------------------------------------------------------------

  const [
    waypointPublicIds,
    setWaypointPublicIds,
  ] = useState<string[]>(
    [...selectedWaypointPublicIds],
  );

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    // There is no valid route submission without an attached corridor.
    //
    // This is only a presentation guard. The backend/application layer remains
    // authoritative for all actual route invariants.
    if (
      corridor === null ||
      isLoading
    ) {
      return;
    }

    await onSubmit({
      corridorPublicId:
        corridor.publicId,
      waypointPublicIds,
    });
  }

  // ---------------------------------------------------------------------------
  // Derived UI state
  // ---------------------------------------------------------------------------

  const canSubmit =
    corridor !== null &&
    !isLoading;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Corridor                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="space-y-2">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">
            Journey corridor
          </p>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Your journey follows the corridor already attached to this
            journey.
          </p>
        </div>

        {corridor ? (
          <Card className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-[var(--foreground)]">
                  {corridor.originName} →{' '}
                  {corridor.destinationName}
                </p>

                <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                  Corridor
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-4 sm:p-5">
            <p className="text-sm font-medium text-[var(--foreground)]">
              No journey corridor attached
            </p>

            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              A journey corridor must be attached before the route can
              be configured.
            </p>
          </Card>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Waypoints                                                            */}
      {/* ------------------------------------------------------------------ */}

      {corridor ? (
        <Card className="space-y-4 p-4 sm:p-5">
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Where can passengers meet you?
            </p>

            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              Select the stops along this corridor where pickup or
              drop-off is available.
            </p>
          </div>

          <JourneyWaypointList
            waypoints={corridor.waypoints}
            selectedWaypointPublicIds={
              waypointPublicIds
            }
            onSelectionChange={(
              nextWaypointPublicIds,
            ) =>
              setWaypointPublicIds(
                [...nextWaypointPublicIds],
              )
            }
            disabled={isLoading}
          />
        </Card>
      ) : null}

      {/* ------------------------------------------------------------------ */}
      {/* Parent/application error                                             */}
      {/* ------------------------------------------------------------------ */}

      {error ? (
        <p
          role="alert"
          className="rounded-lg bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]"
        >
          {error}
        </p>
      ) : null}

      {/* ------------------------------------------------------------------ */}
      {/* Form action                                                          */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex justify-end border-t border-[var(--border-subtle)] pt-4">
        <Button
          type="submit"
          disabled={!canSubmit}
        >
          {isLoading
            ? 'Saving…'
            : 'Continue'}
        </Button>
      </div>
    </form>
  );
}