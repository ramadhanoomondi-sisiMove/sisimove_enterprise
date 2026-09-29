// -----------------------------------------------------------------------------
// sisiMove — Journey Waypoints
// -----------------------------------------------------------------------------
//
// Read-only collection presentation for Journey waypoints.
//
// Responsibilities:
// - render the supplied waypoint collection;
// - preserve backend sequence;
// - delegate individual waypoint presentation.
//
// This component does NOT:
// - sort the collection;
// - mutate waypoints;
// - infer pickup/drop-off permissions;
// - calculate route geometry.
//
// The backend/application layer remains authoritative for waypoint ordering.
//
// -----------------------------------------------------------------------------

import { cn } from "@/foundation";

import type { JourneyWaypoint } from "@/features/journey/models";

import { JourneyWaypointItem } from "./journey-waypoint-item";

// =============================================================================
// Props
// =============================================================================

export interface JourneyWaypointsProps {
  readonly waypoints: readonly JourneyWaypoint[];
  readonly showPermissions?: boolean;
  readonly emptyMessage?: string;
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyWaypoints({
  waypoints,
  showPermissions = true,
  emptyMessage = "No additional stops have been added.",
  className,
}: JourneyWaypointsProps) {
  return (
    <div className={cn("w-full", className)}>
      {waypoints.length === 0 ? (
        <p className="text-sm text-[var(--foreground-muted)]">
          {emptyMessage}
        </p>
      ) : (
        <ol
          className={cn(
            "space-y-2",
            "list-none",
            "p-0",
          )}
          aria-label="Journey waypoints"
        >
          {waypoints.map((waypoint) => (
            <JourneyWaypointItem
              key={waypoint.publicId}
              waypoint={waypoint}
              showPermissions={showPermissions}
            />
          ))}
        </ol>
      )}
    </div>
  );
}