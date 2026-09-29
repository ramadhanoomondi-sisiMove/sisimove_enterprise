// -----------------------------------------------------------------------------
// sisiMove — Journey Waypoint Item
// -----------------------------------------------------------------------------
//
// Read-only presentation of one Journey waypoint.
//
// The waypoint's explicit pickup/drop-off permissions are displayed exactly as
// supplied by the backend. The component does not infer permissions from the
// waypoint type.
//
// -----------------------------------------------------------------------------

import { cn } from "@/foundation";

import type { JourneyWaypoint } from "@/features/journey/models";

// =============================================================================
// Props
// =============================================================================

export interface JourneyWaypointItemProps {
  readonly waypoint: JourneyWaypoint;
  readonly showPermissions?: boolean;
  readonly className?: string;
}

// =============================================================================
// Helpers
// =============================================================================

function formatWaypointType(type: JourneyWaypoint["type"]): string {
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

    default:
      return type;
  }
}

// =============================================================================
// Component
// =============================================================================

export function JourneyWaypointItem({
  waypoint,
  showPermissions = true,
  className,
}: JourneyWaypointItemProps) {
  return (
    <li
      className={cn(
        "rounded-[var(--radius-md)]",
        "border border-[var(--border-subtle)]",
        "bg-[var(--surface)]",
        "p-3",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        {/* ------------------------------------------------------------------- */}
        {/* Sequence                                                            */}
        {/* ------------------------------------------------------------------- */}

        <span
          className={cn(
            "flex",
            "size-8",
            "shrink-0",
            "items-center",
            "justify-center",
            "rounded-[var(--radius-full)]",
            "bg-[var(--brand-soft)]",
            "text-xs",
            "font-semibold",
            "text-[var(--brand)]",
          )}
          aria-label={`Stop ${waypoint.sequence}`}
        >
          {waypoint.sequence}
        </span>

        {/* ------------------------------------------------------------------- */}
        {/* Waypoint information                                                */}
        {/* ------------------------------------------------------------------- */}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-sm font-semibold text-[var(--foreground)]">
              {waypoint.name}
            </p>

            <span
              className={cn(
                "rounded-[var(--radius-full)]",
                "bg-[var(--background-muted)]",
                "px-2",
                "py-0.5",
                "text-xs",
                "font-medium",
                "text-[var(--foreground-secondary)]",
              )}
            >
              {formatWaypointType(waypoint.type)}
            </span>
          </div>

          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            {waypoint.latitude}, {waypoint.longitude}
          </p>

          {showPermissions ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={cn(
                  "rounded-[var(--radius-full)]",
                  "px-2",
                  "py-1",
                  "text-xs",
                  "font-medium",
                  waypoint.pickupAllowed
                    ? "bg-[var(--success-soft)] text-[var(--success)]"
                    : "bg-[var(--background-muted)] text-[var(--foreground-muted)]",
                )}
              >
                {waypoint.pickupAllowed
                  ? "Pickup allowed"
                  : "Pickup unavailable"}
              </span>

              <span
                className={cn(
                  "rounded-[var(--radius-full)]",
                  "px-2",
                  "py-1",
                  "text-xs",
                  "font-medium",
                  waypoint.dropoffAllowed
                    ? "bg-[var(--success-soft)] text-[var(--success)]"
                    : "bg-[var(--background-muted)] text-[var(--foreground-muted)]",
                )}
              >
                {waypoint.dropoffAllowed
                  ? "Drop-off allowed"
                  : "Drop-off unavailable"}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </li>
  );
}