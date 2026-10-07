// -----------------------------------------------------------------------------
// Path: src/features/journey/components/shared/JourneyCorridorSummary.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Corridor Summary
// -----------------------------------------------------------------------------
//
// Read-only presentation of the Journey corridor.
//
// Responsibilities:
// - display origin and destination;
// - display their coordinates when useful;
// - use subtle Lucide location icons;
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

import { MapPin, MapPinCheck } from "lucide-react";

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
  const panelClassName = cn(
    "w-full",
    "min-w-0",
    "max-w-full",
    "rounded-[clamp(0.4rem,1vw,0.75rem)]",
    "border",
    "border-[var(--border-subtle)]",
    "bg-[var(--background-subtle)]",
    "px-[clamp(0.42rem,1.25vw,0.9rem)]",
    "py-[clamp(0.4rem,1.1vw,0.9rem)]",
  );

  const contentClassName = cn(
    "flex",
    "min-w-0",
    "max-w-full",
    "items-start",
    "gap-[clamp(0.28rem,0.9vw,0.7rem)]",
  );

  const iconClassName = cn(
    "mt-[clamp(0.04rem,0.15vw,0.15rem)]",
    "size-[clamp(0.52rem,1.2vw,0.95rem)]",
    "shrink-0",
    "text-[var(--brand)]",
  );

  const labelClassName = cn(
    "min-w-0",
    "truncate",
    "text-[clamp(0.32rem,0.7vw,0.62rem)]",
    "font-medium",
    "uppercase",
    "tracking-[clamp(0.04em,0.07em,0.07em)]",
    "leading-tight",
    "text-[var(--foreground-muted)]",
  );

  const locationClassName = cn(
    "mt-[clamp(0.06rem,0.25vw,0.2rem)]",
    "min-w-0",
    "truncate",
    "text-[clamp(0.5rem,1.1vw,0.88rem)]",
    "font-semibold",
    "leading-tight",
    "text-[var(--foreground)]",
  );

  const coordinateClassName = cn(
    "mt-[clamp(0.12rem,0.5vw,0.4rem)]",
    "min-w-0",
    "truncate",
    "text-[clamp(0.32rem,0.72vw,0.62rem)]",
    "leading-tight",
    "text-[var(--foreground-muted)]",
  );

  return (
    <div
      className={cn(
        "w-full",
        "min-w-0",
        "max-w-full",
        "space-y-[clamp(0.25rem,0.9vw,0.7rem)]",
        className,
      )}
    >
      {/* --------------------------------------------------------------------- */}
      {/* Origin                                                                */}
      {/* --------------------------------------------------------------------- */}

      <div className={panelClassName}>
        <div className={contentClassName}>
          <MapPin
            className={iconClassName}
            aria-hidden="true"
          />

          <div className="min-w-0 flex-1">
            <p className={labelClassName}>
              From
            </p>

            <p
              className={locationClassName}
              title={route.origin.name}
            >
              {route.origin.name}
            </p>

            {showCoordinates ? (
              <p
                className={coordinateClassName}
                title={`${route.origin.latitude}, ${route.origin.longitude}`}
              >
                {route.origin.latitude},{" "}
                {route.origin.longitude}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* Destination                                                           */}
      {/* --------------------------------------------------------------------- */}

      <div className={panelClassName}>
        <div className={contentClassName}>
          <MapPinCheck
            className={iconClassName}
            aria-hidden="true"
          />

          <div className="min-w-0 flex-1">
            <p className={labelClassName}>
              To
            </p>

            <p
              className={locationClassName}
              title={route.destination.name}
            >
              {route.destination.name}
            </p>

            {showCoordinates ? (
              <p
                className={coordinateClassName}
                title={`${route.destination.latitude}, ${route.destination.longitude}`}
              >
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
