// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Waypoint Item
// -----------------------------------------------------------------------------
//
// Read-only presentation of one Journey Demand waypoint.
//
// Responsibilities:
// - Render the supplied waypoint.
// - Display the backend-provided sequence.
// - Display the waypoint name and type.
// - Display the supplied coordinates.
// - Display the explicit pickup/drop-off requirements.
//
// This component does NOT:
// - fetch data;
// - mutate data;
// - reconstruct backend value objects;
// - calculate distance, duration, or route geometry;
// - calculate or modify sequence;
// - infer business meaning from waypoint data.
//
// The parent collection owns iteration:
//
//     JourneyDemandWaypoints
//          ↓
//     JourneyDemandWaypointItem
//
// Editable waypoint workflows use JourneyDemandWaypointEditor instead.
//
// -----------------------------------------------------------------------------

import type { JourneyDemandWaypoint } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyDemandWaypointItemProps {
  /**
   * Complete backend-projected waypoint.
   */
  readonly waypoint: JourneyDemandWaypoint;

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
      {/* -----------------------------------------------------------------------
          Sequence

          Sequence is authoritative backend data.

          Do not derive this value from the array index. The backend owns
          waypoint ordering and the waypoint model already contains its
          authoritative sequence.
      ----------------------------------------------------------------------- */}

      <span
        className={cn(
          'flex shrink-0 items-center justify-center',
          'rounded-[var(--radius-full)]',
          'bg-[var(--background-muted)]',
          'font-semibold text-foreground-secondary',
          isCompact
            ? 'size-5 text-[10px]'
            : 'size-6 text-xs',
        )}
        aria-label={`Waypoint ${waypoint.sequence}`}
      >
        {waypoint.sequence}
      </span>

      {/* -----------------------------------------------------------------------
          Waypoint content
      ----------------------------------------------------------------------- */}

      <div className="min-w-0 flex-1">
        {/* ---------------------------------------------------------------------
            Identity
        --------------------------------------------------------------------- */}

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

        {/* ---------------------------------------------------------------------
            Coordinates

            Coordinates are already represented by the frontend model as:

                waypoint.coordinates.latitude
                waypoint.coordinates.longitude

            No transformation or derived geographic information is performed
            here.
        --------------------------------------------------------------------- */}

        <p
          className={cn(
            'mt-1',
            'text-foreground-muted',
            isCompact ? 'text-[11px]' : 'text-xs',
          )}
        >
          {waypoint.coordinates.latitude},{' '}
          {waypoint.coordinates.longitude}
        </p>

        {/* ---------------------------------------------------------------------
            Operational requirements

            These flags are rendered exactly as supplied by the backend.

            A false value means nothing is rendered for that requirement.
            No additional business state is inferred.
        --------------------------------------------------------------------- */}

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
// Presentation helpers
// -----------------------------------------------------------------------------

function formatWaypointType(
  type: JourneyDemandWaypoint['type'],
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