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
//   Journey vehicle
//
// Product role:
//
//     Know the vehicle
//          │
//          ▼
//     Recognise the Journey
//          │
//          ▼
//     Book with clearer expectations
//
// Responsibilities:
// - present the vehicle make and model prominently;
// - present optional year and color when supplied;
// - keep vehicle presentation independent from Asset retrieval;
// - avoid exposing registration in the public summary because its visibility
//   is subject to the Journey privacy contract;
// - provide a clear vehicle identity alongside the Journey vehicle asset.
//
// This component does NOT:
// - resolve assetPublicId into an image;
// - fetch Asset data;
// - expose registration;
// - modify vehicle state;
// - recreate JourneyVehicle domain behavior.
//
// -----------------------------------------------------------------------------

import type { JourneyVehicle } from "@/features/journey/models";

import { cn } from "@/foundation/utils/cn";

// =============================================================================
// Props
// =============================================================================

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

// =============================================================================
// Component
// =============================================================================

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
      {/* Vehicle identity                                                    */}
      {/* ------------------------------------------------------------------- */}

      <p
        className={cn(
          "truncate",
          "text-[clamp(0.8rem,1.35vw,1rem)]",
          "font-extrabold",
          "leading-tight",
          "tracking-tight",
          "text-[var(--foreground)]",
        )}
      >
        {vehicleName || "Vehicle"}
      </p>

      {/* ------------------------------------------------------------------- */}
      {/* Vehicle metadata                                                    */}
      {/* ------------------------------------------------------------------- */}

      {metadata.length > 0 ? (
        <p
          className={cn(
            "mt-1",
            "truncate",
            "text-[clamp(0.62rem,0.9vw,0.75rem)]",
            "font-semibold",
            "leading-tight",
            "text-[var(--foreground-secondary)]",
          )}
        >
          {metadata.join(" · ")}
        </p>
      ) : null}

      {/* ------------------------------------------------------------------- */}
      {/* Supporting label                                                    */}
      {/* ------------------------------------------------------------------- */}

      <p
        className={cn(
          "mt-1",
          "truncate",
          "text-[clamp(0.55rem,0.72vw,0.65rem)]",
          "font-medium",
          "leading-tight",
          "text-[var(--foreground-muted)]",
        )}
      >
        Journey vehicle
      </p>
    </div>
  );
}

export default JourneyVehicleSummary;