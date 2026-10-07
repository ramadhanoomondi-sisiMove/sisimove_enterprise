// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Waypoints
// -----------------------------------------------------------------------------
//
// Read-only presentation of a Journey Demand waypoint collection.
//
// Responsibilities:
// - Render the supplied waypoint collection.
// - Preserve the collection order supplied by the backend.
// - Delegate individual waypoint rendering to JourneyDemandWaypointItem.
//
// This component does NOT:
// - fetch data;
// - mutate data;
// - create, remove, or reorder waypoints;
// - calculate route distance, duration, or geometry;
// - reconstruct waypoint sequence.
//
// The backend owns waypoint ordering through `sequence`.
//
// This component is intentionally read-only. Editable waypoint workflows use
// JourneyDemandWaypointEditor and are owned by the appropriate editor
// component, such as JourneyDemandCorridorEditor.
//
// -----------------------------------------------------------------------------
//
// Data flow:
//
//     JourneyDemand
//          ↓
//     JourneyDemandWaypoints
//          ↓
//     JourneyDemandWaypointItem
//
// -----------------------------------------------------------------------------

import type { JourneyDemandWaypoint } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

import { JourneyDemandWaypointItem } from './journey-demand-waypoint-item';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type JourneyDemandWaypointEmphasis = 'compact' | 'default';

export interface JourneyDemandWaypointsProps {
  /**
   * Ordered Journey Demand waypoint collection.
   *
   * The supplied order is authoritative and is preserved exactly as received.
   */
  readonly waypoints: readonly JourneyDemandWaypoint[];

  /**
   * Presentation density.
   *
   * `default` is the normal detail presentation.
   * `compact` is intended for denser authenticated or summary surfaces.
   */
  readonly emphasis?: JourneyDemandWaypointEmphasis;

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
  // ---------------------------------------------------------------------------
  // Empty collection
  //
  // There is nothing for this read-only presentation component to render.
  // The parent decides whether an empty collection needs an explanatory message.
  // ---------------------------------------------------------------------------

  if (waypoints.length === 0) {
    return null;
  }

  const isCompact = emphasis === 'compact';

  return (
    <section
      className={cn('min-w-0', className)}
      aria-label="Journey Demand waypoints"
    >
      {/* -----------------------------------------------------------------------
          Collection header
      ----------------------------------------------------------------------- */}

      <div className="flex min-w-0 items-center justify-between gap-3">
        <h3
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
          {waypoints.length} {waypoints.length === 1 ? 'stop' : 'stops'}
        </span>
      </div>

      {/* -----------------------------------------------------------------------
          Waypoint collection
          
          IMPORTANT:
          Do not sort this collection here.
          
          The backend owns waypoint ordering and provides the collection in
          authoritative order. The individual item receives its own backend
          sequence for display.
      ----------------------------------------------------------------------- */}

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