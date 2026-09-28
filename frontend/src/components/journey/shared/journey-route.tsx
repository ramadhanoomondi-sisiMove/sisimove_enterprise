// -----------------------------------------------------------------------------
// sisiMove — Journey Route
// -----------------------------------------------------------------------------
//
// Reusable presentation of a Journey route.
//
// Responsibilities:
// - Present the Journey origin and destination clearly.
// - Optionally expose intermediate waypoints.
// - Provide a compact route representation for marketplace and detail surfaces.
// - Remain purely presentational.
//
// This component does NOT:
// - calculate routes;
// - geocode locations;
// - infer route distance or duration;
// - modify Journey state;
// - recreate JourneyCorridor domain behavior.
//
// The JourneyRoute model remains the source of truth for displayed data.
// -----------------------------------------------------------------------------

import type { JourneyRoute } from "@/features/journey/models";
import { cn } from "@/foundation/utils/cn";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyRouteProps {
  /**
   * Journey route projection supplied by the backend.
   */
  readonly route: JourneyRoute;

  /**
   * Whether intermediate waypoints should be displayed.
   *
   * Defaults to `false` so marketplace cards remain compact.
   */
  readonly showWaypoints?: boolean;

  /**
   * Optional additional CSS classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyRoute({
  route,
  showWaypoints = false,
  className,
}: JourneyRouteProps) {
  return (
    <div className={cn("min-w-0 space-y-3", className)}>
      <div className="flex min-w-0 items-stretch gap-3">
        {/* -----------------------------------------------------------------
            Route indicator
            ----------------------------------------------------------------- */}

        <div
          aria-hidden="true"
          className="flex w-4 shrink-0 flex-col items-center pt-1"
        >
          <span
            className={cn(
              "size-2.5",
              "rounded-full",
              "border-2",
              "border-[var(--brand)]",
              "bg-[var(--surface)]",
            )}
          />

          <span
            className={cn(
              "my-1",
              "w-px",
              "flex-1",
              "bg-[var(--border)]",
            )}
          />

          <span
            className={cn(
              "size-2.5",
              "rounded-full",
              "bg-[var(--brand)]",
            )}
          />
        </div>

        {/* -----------------------------------------------------------------
            Origin / destination
            ----------------------------------------------------------------- */}

        <div className="min-w-0 flex-1">
          <div className="min-w-0">
            <p className="text-xs font-medium text-[var(--foreground-muted)]">
              From
            </p>

            <p className="truncate text-sm font-semibold text-[var(--foreground)]">
              {route.origin.name}
            </p>
          </div>

          <div className="py-4" />

          <div className="min-w-0">
            <p className="text-xs font-medium text-[var(--foreground-muted)]">
              To
            </p>

            <p className="truncate text-sm font-semibold text-[var(--foreground)]">
              {route.destination.name}
            </p>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          Waypoints
          --------------------------------------------------------------------- */}

      {showWaypoints && route.waypoints.length > 0 && (
        <div
          className={cn(
            "border-t",
            "border-[var(--border-subtle)]",
            "pt-3",
          )}
        >
          <p className="mb-2 text-xs font-medium text-[var(--foreground-muted)]">
            Stops
          </p>

          <div className="space-y-2">
            {route.waypoints.map((waypoint) => (
              <div
                key={waypoint.publicId}
                className="flex min-w-0 items-start gap-2"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-1.5",
                    "size-1.5",
                    "shrink-0",
                    "rounded-full",
                    "bg-[var(--foreground-subtle)]",
                  )}
                />

                <div className="min-w-0">
                  <p className="truncate text-sm text-[var(--foreground-secondary)]">
                    {waypoint.name}
                  </p>

                  {(waypoint.pickupAllowed ||
                    waypoint.dropoffAllowed) && (
                    <p className="text-xs text-[var(--foreground-muted)]">
                      {waypoint.pickupAllowed && waypoint.dropoffAllowed
                        ? "Pickup & drop-off"
                        : waypoint.pickupAllowed
                          ? "Pickup"
                          : "Drop-off"}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}