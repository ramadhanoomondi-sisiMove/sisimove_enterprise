// -----------------------------------------------------------------------------
// Path: src/features/journey/components/shared/JourneyVehicleSummary.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Vehicle Summary
//
// Prominent presentation of a Journey vehicle for marketplace surfaces.
//
// Marketplace presentation:
//
//   Toyota Probox
//   2019 · White
//
// Responsibilities:
// - Present the vehicle make and model prominently.
// - Present optional year and color when supplied.
// - Keep vehicle presentation independent from Asset retrieval.
// - Avoid exposing registration in the public summary because its visibility
//   is subject to the Journey privacy contract.
// - Provide a clear vehicle identity alongside the Journey vehicle asset.
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
    vehicle.year !== null
      ? String(vehicle.year)
      : null,
    vehicle.color,
  ].filter(Boolean);

  return (
    <div
      className={cn(
        "min-w-0",
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Vehicle Identity                                                    */}
      {/* ------------------------------------------------------------------- */}

      <p
        className={cn(
          "truncate",
          "text-[clamp(0.68rem,1.15vw,0.92rem)]",
          "font-bold",
          "leading-tight",
          "tracking-tight",
          "text-[var(--foreground)]",
        )}
      >
        {vehicleName || "Vehicle"}
      </p>

      {/* ------------------------------------------------------------------- */}
      {/* Vehicle Metadata                                                    */}
      {/* ------------------------------------------------------------------- */}

      {metadata.length > 0 ? (
        <p
          className={cn(
            "mt-[clamp(0.18rem,0.35vw,0.3rem)]",
            "truncate",
            "text-[clamp(0.48rem,0.75vw,0.64rem)]",
            "font-medium",
            "leading-tight",
            "text-[var(--foreground-secondary)]",
          )}
        >
          {metadata.join(" · ")}
        </p>
      ) : null}

      {/* ------------------------------------------------------------------- */}
      {/* Supporting Label                                                    */}
      {/* ------------------------------------------------------------------- */}

      <p
        className={cn(
          "mt-[clamp(0.18rem,0.35vw,0.3rem)]",
          "truncate",
          "text-[clamp(0.42rem,0.65vw,0.55rem)]",
          "leading-tight",
          "text-[var(--foreground-muted)]",
        )}
      >
        Journey vehicle
      </p>
    </div>
  );
}