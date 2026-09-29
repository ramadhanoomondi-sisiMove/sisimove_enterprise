// -----------------------------------------------------------------------------
// sisiMove — Journey Vehicle
// -----------------------------------------------------------------------------
//
// Presents the vehicle information associated with a Journey.
//
// Responsibilities:
// - present the vehicle make/model and available descriptive details;
// - present an associated vehicle image when a resolved PublicAsset is supplied.
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
// - The public Journey vehicle projection may technically contain a
//   registration, but the product privacy boundary does not expose the full
//   registration before acceptance/payment. Therefore this component delegates
//   vehicle presentation to the existing safe summary and does not render the
//   registration.
//
// -----------------------------------------------------------------------------

import { cn } from "@/foundation";

import type {
  JourneyAsset,
  JourneyVehicle as JourneyVehicleModel,
} from "@/features/journey/models";
import type { PublicAsset } from "@/features/assets/models";

import { JourneyVehicleAsset, JourneyVehicleSummary } from "../shared";

export interface JourneyVehicleProps {
  readonly vehicle: JourneyVehicleModel;
  readonly assets?: readonly JourneyAsset[];
  readonly publicAssets?: readonly PublicAsset[];
  readonly className?: string;
}

export function JourneyVehicle({
  vehicle,
  assets = [],
  publicAssets = [],
  className,
}: JourneyVehicleProps) {
  const vehicleAssets = assets.filter((asset) => asset.type === "VEHICLE");

  return (
    <section
      className={cn(
        "w-full",
        "rounded-[var(--radius-lg)]",
        "border border-[var(--border)]",
        "bg-[var(--surface)]",
        "p-4",
        className,
      )}
      aria-labelledby="journey-vehicle-heading"
    >
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">
          Vehicle
        </p>

        <h2
          id="journey-vehicle-heading"
          className="mt-1 text-lg font-semibold text-[var(--foreground)]"
        >
          Your Journey vehicle
        </h2>

        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Vehicle information supplied for this Journey.
        </p>
      </div>

      <div
        className={cn(
          "rounded-[var(--radius-md)]",
          "bg-[var(--background-subtle)]",
          "p-4",
        )}
      >
        <JourneyVehicleSummary vehicle={vehicle} />
      </div>

      {vehicleAssets.length > 0 ? (
        <div className="mt-4 space-y-3">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            Vehicle images
          </h3>

          <div className="space-y-2">
            {vehicleAssets.map((asset) => (
              <JourneyVehicleAsset
                key={asset.publicId}
                asset={asset}
                publicAsset={
                  publicAssets.find(
                    (publicAsset) =>
                      publicAsset.publicId === asset.assetPublicId,
                  ) ?? null
                }
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}