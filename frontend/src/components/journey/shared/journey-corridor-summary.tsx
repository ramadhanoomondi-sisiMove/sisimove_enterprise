// -----------------------------------------------------------------------------
// sisiMove — Journey Corridor Summary
// -----------------------------------------------------------------------------
//
// Read-only presentation of the Journey corridor.
//
// Responsibilities:
// - display origin and destination;
// - display their coordinates when useful;
// - remain reusable by create/manage workflows;
// - remain independent from persistence.
//
// This component does NOT:
// - geocode locations;
// - calculate distances;
// - mutate the Journey;
// - create a JourneyCorridor entity;
// - infer waypoints;
// - call the Journey API.
//
// The backend owns corridor creation and validation.
//
// -----------------------------------------------------------------------------

import { cn } from "@/foundation";

import type { JourneyRoute } from "@/features/journey/models";

// =============================================================================
// Props
// =============================================================================

export interface JourneyCorridorSummaryProps {
  readonly route: JourneyRoute;
  readonly showCoordinates?: boolean;
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyCorridorSummary({
  route,
  showCoordinates = false,
  className,
}: JourneyCorridorSummaryProps) {
  return (
    <div
      className={cn(
        "w-full",
        "space-y-3",
        className,
      )}
    >
      {/* --------------------------------------------------------------------- */}
      {/* Origin                                                                */}
      {/* --------------------------------------------------------------------- */}

      <div
        className={cn(
          "rounded-[var(--radius-md)]",
          "border border-[var(--border-subtle)]",
          "bg-[var(--background-subtle)]",
          "p-3",
        )}
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className={cn(
              "mt-1",
              "flex",
              "size-2.5",
              "shrink-0",
              "rounded-[var(--radius-full)]",
              "bg-[var(--brand)]",
              "ring-4",
              "ring-[var(--brand-soft)]",
            )}
          />

          <div className="min-w-0">
            <p className="text-xs font-medium text-[var(--foreground-muted)]">
              From
            </p>

            <p className="mt-0.5 text-sm font-semibold text-[var(--foreground)]">
              {route.origin.name}
            </p>

            {showCoordinates ? (
              <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                {route.origin.latitude}, {route.origin.longitude}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* Destination                                                           */}
      {/* --------------------------------------------------------------------- */}

      <div
        className={cn(
          "rounded-[var(--radius-md)]",
          "border border-[var(--border-subtle)]",
          "bg-[var(--background-subtle)]",
          "p-3",
        )}
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className={cn(
              "mt-1",
              "flex",
              "size-2.5",
              "shrink-0",
              "rounded-[var(--radius-full)]",
              "bg-[var(--foreground-muted)]",
            )}
          />

          <div className="min-w-0">
            <p className="text-xs font-medium text-[var(--foreground-muted)]">
              To
            </p>

            <p className="mt-0.5 text-sm font-semibold text-[var(--foreground)]">
              {route.destination.name}
            </p>

            {showCoordinates ? (
              <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                {route.destination.latitude},{" "}
                {route.destination.longitude}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}