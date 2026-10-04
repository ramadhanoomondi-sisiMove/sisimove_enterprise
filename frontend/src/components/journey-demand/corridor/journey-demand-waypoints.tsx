// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Waypoints
// -----------------------------------------------------------------------------
//
// Read-only presentation of Journey Demand waypoints.
//
// Architecture:
// - Consumes the authenticated Journey Demand waypoint model.
// - Does not fetch data.
// - Does not mutate data.
// - Does not create, remove, or reorder waypoints.
// - Does not calculate route distance, duration, or geometry.
// - Delegates individual waypoint presentation to JourneyDemandWaypointItem.
//
// The backend owns waypoint ordering through `sequence`.
// This component therefore preserves the supplied collection order and does
// not sort or reconstruct the collection.
//
// Authenticated/editor components consume `JourneyDemandWaypoint`, which
// contains the complete waypoint representation required by the Journey
// Demand management workflow.
//
// -----------------------------------------------------------------------------

import type { JourneyDemandWaypoint } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

import { JourneyDemandWaypointItem } from './journey-demand-waypoint-item';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandWaypointsProps {
  /**
   * Ordered Journey Demand waypoint collection.
   *
   * Ordering supplied by the backend is preserved.
   */
  readonly waypoints: readonly JourneyDemandWaypoint[];

  /**
   * Presentation density.
   */
  readonly emphasis?: 'compact' | 'default';

  /**
   * Optional additional class names.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandWaypoints({
  waypoints,
  emphasis = 'default',
  className,
}: JourneyDemandWaypointsProps) {
  const isCompact = emphasis === 'compact';

  // ---------------------------------------------------------------------------
  // Empty state
  // ---------------------------------------------------------------------------

  if (waypoints.length === 0) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Presentation
  // ---------------------------------------------------------------------------

  return (
    <section
      className={cn(
        'min-w-0',
        className,
      )}
      aria-labelledby="journey-demand-waypoints-heading"
    >
      {/* ---------------------------------------------------------------------
          Collection heading
      --------------------------------------------------------------------- */}

      <div className="flex min-w-0 items-center justify-between gap-3">
        <h3
          id="journey-demand-waypoints-heading"
          className={cn(
            'font-medium text-foreground',
            isCompact ? 'text-xs' : 'text-sm',
          )}
        >
          Waypoints
        </h3>

        <span
          className={cn(
            'shrink-0 text-foreground-muted',
            isCompact ? 'text-[11px]' : 'text-xs',
          )}
        >
          {waypoints.length}{' '}
          {waypoints.length === 1 ? 'stop' : 'stops'}
        </span>
      </div>

      {/* ---------------------------------------------------------------------
          Waypoint collection
          
          IMPORTANT:
          The backend-provided order is preserved.

          Do not sort by sequence here. The collection is already represented
          in its authoritative order by the backend response.
      --------------------------------------------------------------------- */}

      <ol
        className={cn(
          'mt-3',
          isCompact ? 'space-y-2' : 'space-y-3',
        )}
      >
        {waypoints.map((waypoint) => (
          <JourneyDemandWaypointItem
            key={waypoint.publicId}
            waypoint={waypoint}
            emphasis={emphasis}
          />
        ))}
      </ol>
    </section>
  );
}