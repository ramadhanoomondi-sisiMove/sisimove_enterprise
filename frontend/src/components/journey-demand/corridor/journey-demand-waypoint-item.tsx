// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Waypoint Item
// -----------------------------------------------------------------------------
//
// Read-only presentation of a single public Journey Demand waypoint.
//
// Architecture:
// - Consumes the public Journey Demand waypoint projection.
// - Does not fetch data.
// - Does not mutate data.
// - Does not reconstruct backend value objects.
// - Does not calculate route distance, duration, or ordering.
// - Uses the backend-provided sequence for display.
// - Does not infer additional business meaning from pickup/drop-off flags.
//
// The parent waypoint collection (098) owns iteration and list composition.
// This component owns the presentation of one waypoint.
//
// IMPORTANT:
// Public corridor components use PublicJourneyDemandWaypoint.
// The authenticated JourneyDemandWaypoint model is intentionally not used
// here because it contains editor/persistence fields such as coordinates,
// createdAt, and updatedAt that are not required by this presentation.
//
// -----------------------------------------------------------------------------

import type { PublicJourneyDemandWaypoint } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

export interface JourneyDemandWaypointItemProps {
  readonly waypoint: PublicJourneyDemandWaypoint;
  readonly emphasis?: 'compact' | 'default';
  readonly className?: string;
}

export function JourneyDemandWaypointItem({
  waypoint,
  emphasis = 'default',
  className,
}: JourneyDemandWaypointItemProps) {
  const isCompact = emphasis === 'compact';

  return (
    <li
      className={cn(
        'flex min-w-0 items-start gap-3',
        className,
      )}
    >
      {/* ---------------------------------------------------------------------
          Sequence marker

          The sequence is supplied by the backend/public projection and is
          therefore displayed directly rather than reconstructed from the
          array position.
      --------------------------------------------------------------------- */}
      <span
        className={cn(
          'flex shrink-0 items-center justify-center rounded-[var(--radius-full)]',
          'bg-[var(--background-muted)] font-semibold text-foreground-secondary',
          isCompact
            ? 'size-5 text-[10px]'
            : 'size-6 text-xs',
        )}
        aria-hidden="true"
      >
        {waypoint.sequence}
      </span>

      {/* ---------------------------------------------------------------------
          Waypoint information
      --------------------------------------------------------------------- */}
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <p
            className={cn(
              'min-w-0 truncate font-medium text-foreground',
              isCompact ? 'text-xs' : 'text-sm',
            )}
          >
            {waypoint.name}
          </p>

          <span
            className={cn(
              'shrink-0 text-foreground-muted',
              isCompact ? 'text-[11px]' : 'text-xs',
            )}
          >
            {formatWaypointType(waypoint.type)}
          </span>
        </div>

        {/* -------------------------------------------------------------------
            Explicit operational requirements

            These values come directly from the public projection. No business
            state is inferred when either flag is false.
        ------------------------------------------------------------------- */}
        {waypoint.pickupRequired || waypoint.dropoffRequired ? (
          <div
            className={cn(
              'mt-1 flex flex-wrap items-center gap-x-2 gap-y-1',
              'text-foreground-muted',
              isCompact ? 'text-[11px]' : 'text-xs',
            )}
          >
            {waypoint.pickupRequired ? (
              <span>Pickup required</span>
            ) : null}

            {waypoint.dropoffRequired ? (
              <span>Drop-off required</span>
            ) : null}
          </div>
        ) : null}
      </div>
    </li>
  );
}

// -----------------------------------------------------------------------------
// Presentation labels
// -----------------------------------------------------------------------------

function formatWaypointType(
  type: PublicJourneyDemandWaypoint['type'],
): string {
  switch (type) {
    case 'ORIGIN':
      return 'Origin';

    case 'DESTINATION':
      return 'Destination';

    case 'PICKUP':
      return 'Pickup';

    case 'DROPOFF':
      return 'Drop-off';

    case 'WAYPOINT':
      return 'Waypoint';

    default:
      return type;
  }
}

