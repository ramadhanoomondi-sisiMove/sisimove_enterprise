// -----------------------------------------------------------------------------
// sisiMove — Journey Vehicle
// -----------------------------------------------------------------------------
//
// Presents the vehicle information associated with a Journey.
//
// Product role:
//
//     See the vehicle
//          │
//          ▼
//     Recognise the Journey
//          │
//          ▼
//     Travel with confidence
//
// Responsibilities:
// - present the vehicle make/model and available descriptive details;
// - present associated vehicle images when resolved PublicAssets are supplied.
//
// Non-responsibilities:
// - no API calls;
// - no data fetching;
// - no vehicle mutation;
// - no registration disclosure;
// - no asset URL construction;
// - no asset fetching;
// - no ownership inference.
//
// `assetPublicId` is an opaque reference. The frontend must not construct an
// image URL from it. A resolved PublicAsset must be supplied by the appropriate
// public asset boundary.
//
// Privacy:
// - the public Journey vehicle projection may technically contain a
//   registration, but the product privacy boundary does not expose the full
//   registration before acceptance/payment. Therefore this component delegates
//   vehicle presentation to the existing safe summary and does not render the
//   registration.
//
// -----------------------------------------------------------------------------

import {
  CarFront,
  Camera,
} from "lucide-react";

import { cn } from "@/foundation";

import type { PublicAsset } from "@/features/assets/models";
import type {
  JourneyAsset,
  JourneyVehicle as JourneyVehicleModel,
} from "@/features/journey/models";

import {
  JourneyVehicleAsset,
  JourneyVehicleSummary,
} from "../shared";

// =============================================================================
// Props
// =============================================================================

export interface JourneyVehicleProps {
  readonly vehicle: JourneyVehicleModel;
  readonly assets?: readonly JourneyAsset[];
  readonly publicAssets?: readonly PublicAsset[];
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyVehicle({
  vehicle,
  assets = [],
  publicAssets = [],
  className,
}: JourneyVehicleProps) {
  const vehicleAssets = assets.filter(
    (asset) => asset.type === "VEHICLE",
  );

  return (
    <section
      className={cn(
        "w-full",
        "overflow-hidden",
        "rounded-[var(--radius-xl)]",
        "border",
        "border-[var(--border)]",
        "bg-[var(--surface)]",
        "shadow-[var(--shadow-sm)]",
        className,
      )}
      aria-labelledby="journey-vehicle-heading"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "border-b",
          "border-[var(--border-subtle)]",
          "bg-[var(--background-brand)]",
          "px-5",
          "py-5",
          "sm:px-6",
          "sm:py-6",
        )}
      >
        <div
          className={cn(
            "flex",
            "items-center",
            "gap-2",
            "text-xs",
            "font-bold",
            "uppercase",
            "tracking-[0.14em]",
            "text-[var(--brand)]",
          )}
        >
          <CarFront
            aria-hidden="true"
            className="size-3.5"
          />

          <span>Journey vehicle</span>
        </div>

        <h2
          id="journey-vehicle-heading"
          className={cn(
            "mt-1.5",
            "text-xl",
            "font-bold",
            "tracking-tight",
            "text-[var(--foreground)]",
            "sm:text-2xl",
          )}
        >
          Know the vehicle you’ll travel in.
        </h2>

        <p
          className={cn(
            "mt-1",
            "max-w-2xl",
            "text-sm",
            "leading-5",
            "text-[var(--foreground-muted)]",
          )}
        >
          Vehicle details and images shared for this Journey.
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Vehicle presentation                                                */}
      {/* ------------------------------------------------------------------- */}

      <div className="p-4 sm:p-5">
        {/* ----------------------------------------------------------------- */}
        {/* Vehicle identity                                                  */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={cn(
            "rounded-[var(--radius-lg)]",
            "border",
            "border-[var(--border)]",
            "bg-[var(--background-subtle)]",
            "p-4",
            "sm:p-5",
          )}
        >
          <JourneyVehicleSummary vehicle={vehicle} />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Vehicle imagery                                                    */}
        {/* ----------------------------------------------------------------- */}

        {vehicleAssets.length > 0 ? (
          <div className="mt-5">
            <div
              className={cn(
                "mb-3",
                "flex",
                "items-center",
                "justify-between",
                "gap-3",
              )}
            >
              <div className="flex items-center gap-2">
                <Camera
                  aria-hidden="true"
                  className="size-4 text-[var(--brand)]"
                />

                <h3
                  className={cn(
                    "text-sm",
                    "font-bold",
                    "text-[var(--foreground)]",
                  )}
                >
                  See the vehicle
                </h3>
              </div>

              <span
                className={cn(
                  "rounded-full",
                  "border",
                  "border-[var(--border)]",
                  "bg-[var(--background-subtle)]",
                  "px-2.5",
                  "py-1",
                  "text-xs",
                  "font-semibold",
                  "text-[var(--foreground-muted)]",
                )}
              >
                {vehicleAssets.length}{" "}
                {vehicleAssets.length === 1 ? "photo" : "photos"}
              </span>
            </div>

            <div
              className={cn(
                "grid",
                "grid-cols-1",
                "gap-3",
                vehicleAssets.length > 1
                  ? "sm:grid-cols-2"
                  : null,
              )}
            >
              {vehicleAssets.map((asset) => (
                <div
                  key={asset.publicId}
                  className={cn(
                    "overflow-hidden",
                    "rounded-[var(--radius-lg)]",
                    "border",
                    "border-[var(--border)]",
                    "bg-[var(--background-muted)]",
                    "shadow-[var(--shadow-sm)]",
                  )}
                >
                  <JourneyVehicleAsset
                    asset={asset}
                    publicAsset={
                      publicAssets.find(
                        (publicAsset) =>
                          publicAsset.publicId ===
                          asset.assetPublicId,
                      ) ?? null
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "mt-5",
              "flex",
              "items-start",
              "gap-3",
              "rounded-[var(--radius-lg)]",
              "border",
              "border-[var(--border-subtle)]",
              "bg-[var(--background-subtle)]",
              "px-4",
              "py-4",
            )}
          >
            <div
              aria-hidden="true"
              className={cn(
                "flex",
                "size-9",
                "shrink-0",
                "items-center",
                "justify-center",
                "rounded-[var(--radius-md)]",
                "bg-[var(--surface)]",
                "text-[var(--foreground-muted)]",
              )}
            >
              <CarFront className="size-4" />
            </div>

            <div className="min-w-0">
              <p
                className={cn(
                  "text-sm",
                  "font-semibold",
                  "text-[var(--foreground-secondary)]",
                )}
              >
                Vehicle images are not available.
              </p>

              <p
                className={cn(
                  "mt-0.5",
                  "text-xs",
                  "leading-5",
                  "text-[var(--foreground-muted)]",
                )}
              >
                Vehicle information is still shown from the Journey
                projection.
              </p>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Supporting message                                                */}
        {/* ----------------------------------------------------------------- */}

        <p
          className={cn(
            "mt-4",
            "px-1",
            "text-xs",
            "leading-5",
            "text-[var(--foreground-muted)]",
          )}
        >
          Vehicle registration details are not displayed in the public Journey
          view.
        </p>
      </div>
    </section>
  );
}

export default JourneyVehicle;