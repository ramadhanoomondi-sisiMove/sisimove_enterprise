// -----------------------------------------------------------------------------
// sisiMove — Journey Detail Route
// -----------------------------------------------------------------------------
//
// Presentation component for the route section of an authenticated Journey
// detail surface.
//
// Responsibilities:
// - Present the Journey corridor.
// - Present attached waypoints in their supplied order.
// - Clearly distinguish the Journey origin and destination.
// - Present intermediate route points when available.
//
// Architectural boundary:
// - Does NOT fetch waypoints.
// - Does NOT attach or detach waypoints.
// - Does NOT create waypoint records.
// - Does NOT perform route calculations.
// - Does NOT own navigation.
//
// The parent detail container supplies the already-resolved Journey model and
// its attached route information.
// -----------------------------------------------------------------------------

import type { Journey } from '@/features/journey/models/journey';
import type { JourneyWaypoint } from '@/features/journey/models/journey-waypoint';

import { Card } from '@/components/ui';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDetailRouteProps {
  journey: Journey;
  className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getWaypointTypeLabel(
  waypoint: JourneyWaypoint,
): string | null {
  switch (waypoint.type) {
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
      return null;
  }
}

function getWaypointName(
  waypoint: JourneyWaypoint,
): string {
  return (
    waypoint.name ??
    waypoint.publicId
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDetailRoute({
  journey,
  className,
}: JourneyDetailRouteProps) {
  const origin =
    journey.corridor?.originName ??
    'Origin not configured';

  const destination =
    journey.corridor?.destinationName ??
    'Destination not configured';

  const waypoints =
    journey.corridor?.waypoints ??
    [];

  return (
    <Card
      variant="outlined"
      padding="md"
      className={className}
    >
      <div className="space-y-5">
        <div>
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Route
          </h2>

          <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
            The route and stops attached to this Journey.
          </p>
        </div>

        {/* -------------------------------------------------------------------
            Corridor
            ------------------------------------------------------------------- */}

        <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background-subtle)] p-4">
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)] text-sm font-semibold text-[var(--brand)]"
            >
              A
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                From
              </p>

              <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                {origin}
              </p>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="ml-4 h-6 border-l border-dashed border-[var(--border-strong)]"
          />

          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)] text-sm font-semibold text-[var(--brand)]"
            >
              B
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                To
              </p>

              <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                {destination}
              </p>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------------
            Waypoints
            ------------------------------------------------------------------- */}

        {waypoints.length > 0 ? (
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Stops and route points
            </h3>

            <ol
              aria-label="Journey route waypoints"
              className="mt-3 space-y-3"
            >
              {waypoints.map(
                (waypoint, index) => {
                  const typeLabel =
                    getWaypointTypeLabel(
                      waypoint,
                    );

                  return (
                    <li
                      key={waypoint.publicId}
                      className="flex items-start gap-3"
                    >
                      <div className="flex shrink-0 flex-col items-center">
                        <span
                          aria-hidden="true"
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs font-medium text-[var(--foreground-secondary)]"
                        >
                          {index + 1}
                        </span>

                        {index <
                        waypoints.length - 1 ? (
                          <span
                            aria-hidden="true"
                            className="mt-1 h-5 border-l border-dashed border-[var(--border-strong)]"
                          />
                        ) : null}
                      </div>

                      <div className="min-w-0 pt-1">
                        <p className="text-sm font-medium text-[var(--foreground)]">
                          {getWaypointName(
                            waypoint,
                          )}
                        </p>

                        {typeLabel ? (
                          <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
                            {typeLabel}
                          </p>
                        ) : null}
                      </div>
                    </li>
                  );
                },
              )}
            </ol>
          </div>
        ) : (
          <p className="text-sm text-[var(--foreground-muted)]">
            No additional waypoints are attached to this Journey.
          </p>
        )}
      </div>
    </Card>
  );
}