// -----------------------------------------------------------------------------
// sisiMove — Journey Waypoints
// -----------------------------------------------------------------------------
//
// Read-only presentation of Journey corridor waypoints.
//
// Responsibilities:
// - Render the backend-provided waypoint collection.
// - Preserve backend sequence ordering.
// - Present waypoint type as human-readable text.
// - Present pickup/dropoff permissions independently from waypoint type.
// - Provide a compact presentation suitable for Journey cards and detail
//   sections.
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
//
// -----------------------------------------------------------------------------
//
// JourneyRoute
//      │
//      └── waypoints[]
//              │
//              ▼
//      JourneyWaypoints
//              │
//              ├── sequence
//              ├── type
//              ├── name
//              ├── pickupAllowed
//              └── dropoffAllowed
//
// -----------------------------------------------------------------------------

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
   * This defaults to true because those permissions are meaningful Journey
   * data and must not be inferred from the waypoint type.
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

function getWaypointTypeLabel(type: JourneyWaypointType): string {
  switch (type) {
    case "ORIGIN":
      return "Origin";

    case "DESTINATION":
      return "Destination";

    case "PICKUP":
      return "Pickup";

    case "DROPOFF":
      return "Drop-off";

    case "WAYPOINT":
      return "Waypoint";
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
        "space-y-2",
        className,
      )}
    >
      {waypoints.map((waypoint) => (
        <div
          key={waypoint.publicId}
          className={cn(
            "flex",
            "min-w-0",
            "items-start",
            "gap-3",
          )}
        >
          {/* -----------------------------------------------------------------
              Sequence indicator
              -----------------------------------------------------------------
              Sequence is backend-provided route ordering. We display it as
              supplied rather than calculating it from the array index.
          ------------------------------------------------------------------ */}
          <span
            aria-hidden="true"
            className={cn(
              "flex",
              "size-7",
              "shrink-0",
              "items-center",
              "justify-center",
              "rounded-full",
              "border",
              "border-[var(--border)]",
              "bg-[var(--background)]",
              "text-xs",
              "font-semibold",
              "text-[var(--foreground-secondary)]",
            )}
          >
            {waypoint.sequence}
          </span>

          {/* -----------------------------------------------------------------
              Waypoint content
              ------------------------------------------------------------------ */}
          <div className="min-w-0 flex-1">
            <div
              className={cn(
                "flex",
                "min-w-0",
                "flex-wrap",
                "items-baseline",
                "gap-x-2",
                "gap-y-0.5",
              )}
            >
              <p
                className={cn(
                  "truncate",
                  "text-sm",
                  "font-medium",
                  "text-[var(--foreground)]",
                )}
              >
                {waypoint.name}
              </p>

              <span
                className={cn(
                  "shrink-0",
                  "text-xs",
                  "text-[var(--foreground-muted)]",
                )}
              >
                {getWaypointTypeLabel(waypoint.type)}
              </span>
            </div>

            {showPermissions && (
              <p
                className={cn(
                  "mt-0.5",
                  "text-xs",
                  "text-[var(--foreground-muted)]",
                )}
              >
                {getPermissionLabel(
                  waypoint.pickupAllowed,
                  waypoint.dropoffAllowed,
                )}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}