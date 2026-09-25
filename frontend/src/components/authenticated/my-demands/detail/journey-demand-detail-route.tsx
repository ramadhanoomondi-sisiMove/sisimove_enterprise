// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Detail Route
// -----------------------------------------------------------------------------
//
// Presents the requested journey corridor and intermediate waypoints.
//
// Responsibilities:
// - Display origin and destination.
// - Display intermediate waypoints in sequence.
// - Clearly distinguish the main journey direction.
//
// This component is presentation-only. Route data is supplied by the parent
// detail container and is not fetched here.
// -----------------------------------------------------------------------------

import { Card, Divider } from '@/components/ui';

import type {
  JourneyDemandCorridor,
  JourneyDemandWaypoint,
} from '@/features/journey-demand/models';

export interface JourneyDemandDetailRouteProps {
  corridor: JourneyDemandCorridor | null;
  waypoints?: JourneyDemandWaypoint[];
}

function formatLocation(
  name: string | null | undefined,
  latitude?: number | null,
  longitude?: number | null,
): string {
  if (name) {
    return name;
  }

  if (latitude != null && longitude != null) {
    return `${latitude}, ${longitude}`;
  }

  return 'Location not specified';
}

function sortWaypoints(
  waypoints: JourneyDemandWaypoint[],
): JourneyDemandWaypoint[] {
  return [...waypoints].sort((a, b) => a.sequence - b.sequence);
}

export function JourneyDemandDetailRoute({
  corridor,
  waypoints = [],
}: JourneyDemandDetailRouteProps) {
  if (!corridor) {
    return (
      <Card padding="lg">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-slate-900">
            Route
          </h2>

          <p className="text-sm text-slate-500">
            Route details have not been provided yet.
          </p>
        </div>
      </Card>
    );
  }

  const orderedWaypoints = sortWaypoints(waypoints);

  return (
    <Card padding="lg">
      <div className="space-y-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Route
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Requested journey corridor and stops.
          </p>
        </div>

        <div className="space-y-4">
          <RoutePoint
            label="Origin"
            name={formatLocation(
              corridor.origin.name,
              corridor.origin.latitude,
              corridor.origin.longitude,
            )}
            emphasized
          />

          {orderedWaypoints.length > 0 ? (
            <>
              <Divider />

              <div className="space-y-4">
                {orderedWaypoints.map((waypoint) => (
                  <RoutePoint
                    key={waypoint.publicId}
                    label={formatWaypointType(waypoint.type)}
                    name={formatLocation(
                      waypoint.name,
                      waypoint.latitude,
                      waypoint.longitude,
                    )}
                  />
                ))}
              </div>
            </>
          ) : null}

          <Divider />

          <RoutePoint
            label="Destination"
            name={formatLocation(
              corridor.destination.name,
              corridor.destination.latitude,
              corridor.destination.longitude,
            )}
            emphasized
          />
        </div>
      </div>
    </Card>
  );
}

interface RoutePointProps {
  label: string;
  name: string;
  emphasized?: boolean;
}

function RoutePoint({
  label,
  name,
  emphasized = false,
}: RoutePointProps) {
  return (
    <div className="flex items-start gap-3">
      <div
        aria-hidden="true"
        className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600"
      />

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>

        <p
          className={
            emphasized
              ? 'mt-0.5 text-sm font-semibold text-slate-900'
              : 'mt-0.5 text-sm text-slate-700'
          }
        >
          {name}
        </p>
      </div>
    </div>
  );
}

function formatWaypointType(
  type: JourneyDemandWaypoint['type'],
): string {
  switch (type) {
    case 'PICKUP':
      return 'Pickup';

    case 'DROPOFF':
      return 'Drop-off';

    case 'WAYPOINT':
      return 'Waypoint';

    case 'ORIGIN':
      return 'Origin';

    case 'DESTINATION':
      return 'Destination';

    default:
      return type;
  }
}