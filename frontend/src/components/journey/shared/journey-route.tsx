// -----------------------------------------------------------------------------
// Path: src/features/journey/components/shared/JourneyRoute.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Route
// -----------------------------------------------------------------------------
//
// Reusable presentation of a Journey route.
//
// Marketplace presentation:
//
//   ●  Nairobi
//   │
//   ●  Mombasa
//
// Responsibilities:
// - Present the Journey origin and destination clearly.
// - Optionally expose intermediate waypoints.
// - Provide a compact route representation for marketplace and detail surfaces.
// - Provide subtle Lucide visual cues for route locations.
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
//
// -----------------------------------------------------------------------------

import { MapPin, MapPinCheck } from "lucide-react";

import type { JourneyRoute as JourneyRouteModel } from "@/features/journey/models";

import { cn } from "@/foundation/utils/cn";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyRouteProps {
  /**
   * Journey route projection supplied by the backend.
   */
  readonly route: JourneyRouteModel;

  /**
   * Whether intermediate waypoints should be displayed.
   *
   * Defaults to false so marketplace cards remain compact.
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
    <div
      className={cn(
        "min-w-0",
        "max-w-full",
        "space-y-[clamp(0.22rem,0.8vw,0.7rem)]",
        className,
      )}
    >
      {/* ---------------------------------------------------------------------
          Primary route
          --------------------------------------------------------------------- */}

      <div
        className={cn(
          "flex",
          "min-w-0",
          "items-stretch",
          "gap-[clamp(0.22rem,0.75vw,0.65rem)]",
        )}
      >
        {/* -------------------------------------------------------------------
            Route indicator
            ------------------------------------------------------------------- */}

        <div
          aria-hidden="true"
          className={cn(
            "flex",
            "w-[clamp(0.55rem,1.25vw,0.95rem)]",
            "shrink-0",
            "flex-col",
            "items-center",
            "pt-[clamp(0.02rem,0.1vw,0.08rem)]",
          )}
        >
          <MapPin
            className={cn(
              "size-[clamp(0.48rem,1.05vw,0.86rem)]",
              "shrink-0",
              "text-[var(--brand)]",
            )}
          />

          <span
            className={cn(
              "my-[clamp(0.08rem,0.3vw,0.25rem)]",
              "w-px",
              "min-h-[clamp(0.45rem,1.2vw,1rem)]",
              "flex-1",
              "bg-[var(--border)]",
            )}
          />

          <MapPinCheck
            className={cn(
              "size-[clamp(0.48rem,1.05vw,0.86rem)]",
              "shrink-0",
              "text-[var(--brand)]",
            )}
          />
        </div>

        {/* -------------------------------------------------------------------
            Origin / destination
            ------------------------------------------------------------------- */}

        <div className="min-w-0 flex-1">
          {/* -----------------------------------------------------------------
              Origin
              ----------------------------------------------------------------- */}

          <div className="min-w-0">
            <p
              className={cn(
                "truncate",
                "text-[clamp(0.28rem,0.6vw,0.52rem)]",
                "font-semibold",
                "uppercase",
                "tracking-[clamp(0.04em,0.07em,0.07em)]",
                "leading-none",
                "text-[var(--foreground-muted)]",
              )}
            >
              From
            </p>

            <p
              className={cn(
                "mt-[clamp(0.08rem,0.3vw,0.25rem)]",
                "min-w-0",
                "truncate",
                "text-[clamp(0.48rem,1.15vw,0.96rem)]",
                "font-extrabold",
                "leading-tight",
                "tracking-tight",
                "text-[var(--foreground)]",
              )}
              title={route.origin.name}
            >
              {route.origin.name}
            </p>
          </div>

          {/* -----------------------------------------------------------------
              Responsive route spacing
              ----------------------------------------------------------------- */}

          <div
            aria-hidden="true"
            className="h-[clamp(0.28rem,0.9vw,0.7rem)]"
          />

          {/* -----------------------------------------------------------------
              Destination
              ----------------------------------------------------------------- */}

          <div className="min-w-0">
            <p
              className={cn(
                "truncate",
                "text-[clamp(0.28rem,0.6vw,0.52rem)]",
                "font-semibold",
                "uppercase",
                "tracking-[clamp(0.04em,0.07em,0.07em)]",
                "leading-none",
                "text-[var(--foreground-muted)]",
              )}
            >
              To
            </p>

            <p
              className={cn(
                "mt-[clamp(0.08rem,0.3vw,0.25rem)]",
                "min-w-0",
                "truncate",
                "text-[clamp(0.48rem,1.15vw,0.96rem)]",
                "font-extrabold",
                "leading-tight",
                "tracking-tight",
                "text-[var(--foreground)]",
              )}
              title={route.destination.name}
            >
              {route.destination.name}
            </p>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          Waypoints
          --------------------------------------------------------------------- */}

      {showWaypoints && route.waypoints.length > 0 ? (
        <div
          className={cn(
            "min-w-0",
            "border-t",
            "border-[var(--border-subtle)]",
            "pt-[clamp(0.22rem,0.8vw,0.65rem)]",
          )}
        >
          <p
            className={cn(
              "mb-[clamp(0.16rem,0.55vw,0.45rem)]",
              "truncate",
              "text-[clamp(0.28rem,0.6vw,0.52rem)]",
              "font-semibold",
              "uppercase",
              "tracking-[clamp(0.04em,0.07em,0.07em)]",
              "leading-none",
              "text-[var(--foreground-muted)]",
            )}
          >
            Stops
          </p>

          <div className="min-w-0 space-y-[clamp(0.16rem,0.55vw,0.45rem)]">
            {route.waypoints.map((waypoint) => (
              <div
                key={waypoint.publicId}
                className={cn(
                  "flex",
                  "min-w-0",
                  "items-start",
                  "gap-[clamp(0.18rem,0.65vw,0.5rem)]",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-[clamp(0.1rem,0.35vw,0.28rem)]",
                    "size-[clamp(0.18rem,0.45vw,0.36rem)]",
                    "shrink-0",
                    "rounded-full",
                    "bg-[var(--foreground-subtle)]",
                  )}
                />

                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "min-w-0",
                      "truncate",
                      "text-[clamp(0.34rem,0.72vw,0.64rem)]",
                      "font-semibold",
                      "leading-tight",
                      "text-[var(--foreground-secondary)]",
                    )}
                    title={waypoint.name}
                  >
                    {waypoint.name}
                  </p>

                  {waypoint.pickupAllowed ||
                  waypoint.dropoffAllowed ? (
                    <p
                      className={cn(
                        "mt-[clamp(0.06rem,0.22vw,0.18rem)]",
                        "truncate",
                        "text-[clamp(0.28rem,0.58vw,0.5rem)]",
                        "leading-tight",
                        "text-[var(--foreground-muted)]",
                      )}
                    >
                      {waypoint.pickupAllowed &&
                      waypoint.dropoffAllowed
                        ? "Pickup & drop-off"
                        : waypoint.pickupAllowed
                          ? "Pickup"
                          : "Drop-off"}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default JourneyRoute;
