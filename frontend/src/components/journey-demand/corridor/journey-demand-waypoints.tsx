// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Waypoints
// -----------------------------------------------------------------------------
//
// Read-only presentation of public Journey Demand waypoints.
//
// Architecture:
// - Consumes the public Journey Demand waypoint projection.
// - Does not fetch data.
// - Does not mutate data.
// - Does not create, remove, or reorder waypoints.
// - Does not calculate route distance, duration, or geometry.
// - Delegates individual waypoint presentation to 097.
//
// The backend/public projection owns waypoint ordering through `sequence`.
// This component therefore preserves the supplied array order and does not
// sort or reconstruct the collection.
//
// Public detail components intentionally consume PublicJourneyDemandWaypoint.
// Authenticated/editor components may consume the richer JourneyDemandWaypoint
// model where coordinates and persistence metadata are required.
//
// -----------------------------------------------------------------------------

import type { PublicJourneyDemandWaypoint } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

import { JourneyDemandWaypointItem } from './journey-demand-waypoint-item';

export interface JourneyDemandWaypointsProps {
  readonly waypoints: readonly PublicJourneyDemandWaypoint[];
  readonly emphasis?: 'compact' | 'default';
  readonly className?: string;
}

export function JourneyDemandWaypoints({
  waypoints,
  emphasis = 'default',
  className,
}: JourneyDemandWaypointsProps) {
  const isCompact = emphasis === 'compact';

  if (waypoints.length === 0) {
    return null;
  }

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

          The supplied backend order is preserved. Do not sort here because
          ordering is part of the Journey Demand corridor representation.
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
