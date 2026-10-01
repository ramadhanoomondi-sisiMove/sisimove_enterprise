// -----------------------------------------------------------------------------
// Path: src/features/journey/components/shared/JourneyVehicleSummary.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Vehicle Summary
//
// Compact one-line vehicle identification for marketplace surfaces.
//
// Marketplace presentation:
//
//   Toyota Probox · 2019 · White · JOURNEY VEHICLE
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
// - avoid exposing registration in the public summary;
// - provide a compact vehicle identity beneath the vehicle image;
// - remain a single-line footer summary for horizontal marketplace cards.
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
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
    .join(" ");

  const metadata = [
    vehicle.year !== null ? String(vehicle.year) : null,
    vehicle.color?.trim() || null,
  ].filter(
    (value): value is string =>
      value !== null &&
      value.length > 0,
  );

  const summaryParts = [
    vehicleName || "Vehicle",
    ...metadata,
    "Journey vehicle",
  ];

  const summary = summaryParts.join(" · ");

  return (
    <div
      className={cn(
        "min-w-0",
        "w-full",
        className,
      )}
    >
      <div
        className={cn(
          "flex",
          "min-w-0",
          "items-center",
          "gap-1.5",
          "overflow-hidden",
          "whitespace-nowrap",
        )}
        title={summary}
      >
        {/* ----------------------------------------------------------------- */}
        {/* Vehicle identity                                                  */}
        {/* ----------------------------------------------------------------- */}

        <span
          className={cn(
            "min-w-0",
            "truncate",
            "text-[clamp(0.72rem,1.15vw,0.95rem)]",
            "font-extrabold",
            "leading-tight",
            "tracking-tight",
            "text-[var(--foreground)]",
          )}
        >
          {vehicleName || "Vehicle"}
        </span>

        {/* ----------------------------------------------------------------- */}
        {/* Optional vehicle metadata                                         */}
        {/* ----------------------------------------------------------------- */}

        {metadata.map((value, index) => (
          <span
            key={`${value}-${index}`}
            className={cn(
              "flex",
              "shrink-0",
              "items-center",
              "gap-1.5",
            )}
          >
            <span
              aria-hidden="true"
              className="text-[var(--foreground-muted)]"
            >
              ·
            </span>

            <span
              className={cn(
                "truncate",
                "text-[clamp(0.58rem,0.8vw,0.72rem)]",
                "font-semibold",
                "leading-tight",
                "text-[var(--foreground-secondary)]",
              )}
            >
              {value}
            </span>
          </span>
        ))}

        {/* ----------------------------------------------------------------- */}
        {/* Supporting label                                                  */}
        {/* ----------------------------------------------------------------- */}

        <span
          className={cn(
            "flex",
            "shrink-0",
            "items-center",
            "gap-1.5",
          )}
        >
          <span
            aria-hidden="true"
            className="text-[var(--foreground-muted)]"
          >
            ·
          </span>

          <span
            aria-hidden="true"
            className={cn(
              "size-[clamp(0.25rem,0.4vw,0.32rem)]",
              "shrink-0",
              "rounded-full",
              "bg-[var(--brand)]",
            )}
          />

          <span
            className={cn(
              "text-[clamp(0.42rem,0.6vw,0.54rem)]",
              "font-semibold",
              "uppercase",
              "tracking-[0.07em]",
              "leading-none",
              "text-[var(--foreground-muted)]",
            )}
          >
            Journey vehicle
          </span>
        </span>
      </div>
    </div>
  );
}

export default JourneyVehicleSummary;