// -----------------------------------------------------------------------------
// Path: src/features/journey/components/shared/JourneyWaypoints.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Waypoints
//
// Compact read-only presentation of Journey corridor waypoints.
//
// Marketplace treatment:
// - Supporting information only.
// - Dense and visually subordinate to the primary Journey information.
// - Preserve backend ordering and permissions.
// - Avoid competing with route, vehicle, price, and capacity.
//
// Responsibilities:
// - Render the backend-provided waypoint collection.
// - Preserve backend sequence ordering.
// - Present waypoint type as human-readable text.
// - Present pickup/dropoff permissions independently from waypoint type.
// - Provide a dense presentation suitable for detail and secondary surfaces.
//
// This component does NOT:
// - infer pickupAllowed from waypoint type;
// - infer dropoffAllowed from waypoint type;
// - reorder waypoints;
// - calculate route information;
// - mutate waypoints;
// - create or remove waypoints;
// - recreate JourneyWaypointEntity behavior.
//
// The backend Journey aggregate remains authoritative for waypoint identity,
// ordering, type, coordinates, and permissions.
// -----------------------------------------------------------------------------

import {
  CircleDot,
  MapPin,
  MapPinCheck,
  PackageCheck,
} from "lucide-react";

import type {
  JourneyWaypoint,
  JourneyWaypointType,
} from "@/features/journey/models";

import { cn } from "@/foundation/utils/cn";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyWaypointsProps {
  /**
   * Backend-projected Journey waypoints.
   *
   * The backend supplies `sequence`, so this component does not derive route
   * ordering from array position.
   */
  readonly waypoints: readonly JourneyWaypoint[];

  /**
   * Whether to display pickup/dropoff permissions for each waypoint.
   *
   * Defaults to true.
   */
  readonly showPermissions?: boolean;

  /**
   * Optional additional CSS classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Presentation
// -----------------------------------------------------------------------------

interface WaypointTypePresentation {
  readonly label: string;
  readonly icon: typeof CircleDot;
}

function getWaypointTypePresentation(
  type: JourneyWaypointType,
): WaypointTypePresentation {
  switch (type) {
    case "ORIGIN":
      return {
        label: "Origin",
        icon: MapPin,
      };

    case "DESTINATION":
      return {
        label: "Destination",
        icon: MapPinCheck,
      };

    case "PICKUP":
      return {
        label: "Pickup",
        icon: MapPin,
      };

    case "DROPOFF":
      return {
        label: "Drop-off",
        icon: PackageCheck,
      };

    case "WAYPOINT":
      return {
        label: "Waypoint",
        icon: CircleDot,
      };
  }
}

// -----------------------------------------------------------------------------
// Permission presentation
// -----------------------------------------------------------------------------

function getPermissionLabel(
  pickupAllowed: boolean,
  dropoffAllowed: boolean,
): string {
  if (pickupAllowed && dropoffAllowed) {
    return "Pickup & drop-off";
  }

  if (pickupAllowed) {
    return "Pickup";
  }

  if (dropoffAllowed) {
    return "Drop-off";
  }

  return "No pickup or drop-off";
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyWaypoints({
  waypoints,
  showPermissions = true,
  className,
}: JourneyWaypointsProps) {
  if (waypoints.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "min-w-0",
        "space-y-[clamp(0.25rem,0.5vw,0.4rem)]",
        className,
      )}
    >
      {waypoints.map((waypoint) => {
        const typePresentation =
          getWaypointTypePresentation(waypoint.type);

        const TypeIcon = typePresentation.icon;

        return (
          <div
            key={waypoint.publicId}
            className={cn(
              "flex",
              "min-w-0",
              "items-center",
              "gap-[clamp(0.3rem,0.6vw,0.5rem)]",
            )}
          >
            {/* -----------------------------------------------------------------
             * Sequence
             * ----------------------------------------------------------------- */}

            <span
              aria-hidden="true"
              className={cn(
                "flex",
                "size-[clamp(0.85rem,1.4vw,1.05rem)]",
                "shrink-0",
                "items-center",
                "justify-center",
                "rounded-full",
                "border",
                "border-[var(--border-subtle)]",
                "bg-[var(--background)]",
                "text-[clamp(0.4rem,0.62vw,0.52rem)]",
                "font-semibold",
                "leading-none",
                "text-[var(--foreground-muted)]",
              )}
            >
              {waypoint.sequence}
            </span>

            {/* -----------------------------------------------------------------
             * Waypoint content
             * ----------------------------------------------------------------- */}

            <div className="min-w-0 flex-1">
              <div
                className={cn(
                  "flex",
                  "min-w-0",
                  "items-center",
                  "gap-[clamp(0.2rem,0.4vw,0.3rem)]",
                )}
              >
                <TypeIcon
                  className={cn(
                    "size-[clamp(0.5rem,0.8vw,0.65rem)]",
                    "shrink-0",
                    "text-[var(--foreground-muted)]",
                  )}
                  aria-hidden="true"
                />

                <p
                  className={cn(
                    "truncate",
                    "text-[clamp(0.48rem,0.72vw,0.62rem)]",
                    "font-medium",
                    "leading-tight",
                    "text-[var(--foreground-secondary)]",
                  )}
                >
                  {waypoint.name}
                </p>
              </div>

              {showPermissions ? (
                <div
                  className={cn(
                    "mt-[clamp(0.1rem,0.2vw,0.15rem)]",
                    "flex",
                    "min-w-0",
                    "items-center",
                    "gap-[clamp(0.2rem,0.4vw,0.3rem)]",
                  )}
                >
                  <span
                    className={cn(
                      "truncate",
                      "text-[clamp(0.4rem,0.62vw,0.52rem)]",
                      "leading-tight",
                      "text-[var(--foreground-muted)]",
                    )}
                  >
                    {typePresentation.label}
                  </span>

                  <span
                    aria-hidden="true"
                    className="shrink-0 text-[clamp(0.4rem,0.6vw,0.5rem)] text-[var(--foreground-subtle)]"
                  >
                    ·
                  </span>

                  <span
                    className={cn(
                      "truncate",
                      "text-[clamp(0.4rem,0.62vw,0.52rem)]",
                      "leading-tight",
                      "text-[var(--foreground-muted)]",
                    )}
                  >
                    {getPermissionLabel(
                      waypoint.pickupAllowed,
                      waypoint.dropoffAllowed,
                    )}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}