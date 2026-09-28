// -----------------------------------------------------------------------------
// sisiMove — Journey Vehicle Summary
// -----------------------------------------------------------------------------
//
// Compact presentation of a Journey vehicle.
//
// Responsibilities:
// - Present the vehicle make and model.
// - Present optional year and color when supplied.
// - Keep vehicle presentation independent from Asset retrieval.
// - Avoid exposing registration in the public summary because its visibility
//   is subject to the Journey privacy contract.
//
// This component does NOT:
// - resolve assetPublicId into an image;
// - fetch Asset data;
// - expose registration;
// - modify vehicle state;
// - recreate JourneyVehicle domain behavior.
// -----------------------------------------------------------------------------

import type { JourneyVehicle } from "@/features/journey/models";
import { cn } from "@/foundation/utils/cn";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyVehicleSummaryProps {
  /**
   * Journey vehicle projection supplied by the backend.
   */
  readonly vehicle: JourneyVehicle;

  /**
   * Optional additional CSS classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyVehicleSummary({
  vehicle,
  className,
}: JourneyVehicleSummaryProps) {
  const vehicleName = [vehicle.make, vehicle.model]
    .filter(Boolean)
    .join(" ");

  const metadata = [
    vehicle.year !== null ? String(vehicle.year) : null,
    vehicle.color,
  ].filter(Boolean);

  return (
    <div className={cn("min-w-0", "space-y-0.5", className)}>
      <p
        className={cn(
          "truncate",
          "text-sm",
          "font-semibold",
          "text-[var(--foreground)]",
        )}
      >
        {vehicleName}
      </p>

      {metadata.length > 0 && (
        <p
          className={cn(
            "truncate",
            "text-xs",
            "text-[var(--foreground-muted)]",
          )}
        >
          {metadata.join(" · ")}
        </p>
      )}
    </div>
  );
}