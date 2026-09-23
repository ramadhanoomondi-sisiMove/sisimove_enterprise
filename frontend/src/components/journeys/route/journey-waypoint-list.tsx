// -----------------------------------------------------------------------------
// sisiMove — Journey Waypoint List
// -----------------------------------------------------------------------------
//
// Waypoint selection list used by the journey route form.
//
// Architectural rule:
// - Waypoints are supplied by the sisiMove-controlled corridor catalogue.
// - This component does not create or modify waypoint definitions.
// - Selection state remains owned by the parent.
// - Backend validation remains authoritative.
//
// Responsibilities:
// - Render the available waypoints in corridor sequence order.
// - Show pickup/drop-off availability.
// - Reflect the current waypoint selection.
// - Report the complete selected waypoint ID collection to the parent.
//
// Non-responsibilities:
// - No API calls.
// - No catalogue fetching.
// - No persistence.
// - No router usage.
// - No route business-rule enforcement.
//
// -----------------------------------------------------------------------------

'use client';

import type { ChangeEvent } from 'react';

// =============================================================================
// Types
// =============================================================================

export interface JourneyWaypointListItem {
  /**
   * Public identifier of the controlled waypoint.
   */
  publicId: string;

  /**
   * Human-readable waypoint name.
   */
  name: string;

  /**
   * Position within the selected corridor.
   */
  sequence: number;

  /**
   * Whether pickup is permitted at this waypoint.
   */
  pickupAllowed: boolean;

  /**
   * Whether drop-off is permitted at this waypoint.
   */
  dropoffAllowed: boolean;
}

export interface JourneyWaypointListProps {
  /**
   * Waypoints belonging to the selected corridor.
   */
  waypoints: readonly JourneyWaypointListItem[];

  /**
   * Currently selected waypoint public identifiers.
   */
  selectedWaypointPublicIds: readonly string[];

  /**
   * Called with the complete next selection.
   */
  onSelectionChange: (
    waypointPublicIds: readonly string[],
  ) => void;

  /**
   * Prevents interaction while the parent is persisting changes.
   */
  disabled?: boolean;

  /**
   * Message shown when the corridor contains no additional waypoints.
   */
  emptyMessage?: string;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyWaypointList({
  waypoints,
  selectedWaypointPublicIds,
  onSelectionChange,
  disabled = false,
  emptyMessage = 'No additional waypoints are available for this corridor.',
}: JourneyWaypointListProps) {
  // ---------------------------------------------------------------------------
  // Keep rendering deterministic according to the controlled corridor
  // sequence.
  // ---------------------------------------------------------------------------

  const sortedWaypoints = [
    ...waypoints,
  ].sort(
    (first, second) =>
      first.sequence -
      second.sequence,
  );

  // ---------------------------------------------------------------------------
  // Use a Set for efficient membership checks while rendering.
  //
  // Selection remains owned by the parent. The Set is only a derived
  // presentation value and is never mutated as component state.
  // ---------------------------------------------------------------------------

  const selectedWaypointIds =
    new Set(
      selectedWaypointPublicIds,
    );

  // ---------------------------------------------------------------------------
  // Selection
  // ---------------------------------------------------------------------------

  function handleChange(
    waypointPublicId: string,
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    if (disabled) {
      return;
    }

    const currentSelection =
      new Set(
        selectedWaypointPublicIds,
      );

    if (event.target.checked) {
      currentSelection.add(
        waypointPublicId,
      );
    } else {
      currentSelection.delete(
        waypointPublicId,
      );
    }

    // Return IDs in corridor sequence order rather than checkbox interaction
    // order. This keeps the emitted UI value deterministic.
    const nextSelection =
      sortedWaypoints
        .filter((waypoint) =>
          currentSelection.has(
            waypoint.publicId,
          ),
        )
        .map(
          (waypoint) =>
            waypoint.publicId,
        );

    onSelectionChange(
      nextSelection,
    );
  }

  // ---------------------------------------------------------------------------
  // Empty state
  // ---------------------------------------------------------------------------

  if (
    sortedWaypoints.length === 0
  ) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--background-subtle)] px-4 py-5">
        <p className="text-sm text-[var(--foreground-muted)]">
          {emptyMessage}
        </p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div
      role="group"
      aria-label="Journey waypoints"
      className="space-y-2"
    >
      {sortedWaypoints.map(
        (waypoint) => {
          const selected =
            selectedWaypointIds.has(
              waypoint.publicId,
            );

          const availability = [
            waypoint.pickupAllowed
              ? 'Pickup'
              : null,
            waypoint.dropoffAllowed
              ? 'Drop-off'
              : null,
          ]
            .filter(Boolean)
            .join(' · ');

          return (
            <label
              key={waypoint.publicId}
              className={[
                'flex items-start gap-3 rounded-xl border p-3',
                'transition-colors',
                selected
                  ? 'border-[var(--brand)] bg-[var(--brand-soft)]'
                  : 'border-[var(--border)] bg-[var(--surface)]',
                disabled
                  ? 'cursor-not-allowed opacity-60'
                  : 'cursor-pointer',
              ].join(' ')}
            >
              <input
                type="checkbox"
                checked={selected}
                onChange={(event) =>
                  handleChange(
                    waypoint.publicId,
                    event,
                  )
                }
                disabled={disabled}
                aria-label={`Select ${waypoint.name}`}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--brand)]"
              />

              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="min-w-0 truncate text-sm font-medium text-[var(--foreground)]">
                    {waypoint.name}
                  </span>

                  <span className="shrink-0 text-xs text-[var(--foreground-subtle)]">
                    #{waypoint.sequence}
                  </span>
                </span>

                <span className="mt-1 block text-xs text-[var(--foreground-muted)]">
                  {availability ||
                    'Journey waypoint'}
                </span>
              </span>
            </label>
          );
        },
      )}
    </div>
  );
}


