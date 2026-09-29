// -----------------------------------------------------------------------------
// Path: src/features/journey/components/shared/JourneyVehicleAsset.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Vehicle Asset
//
// Compact presentation of a Journey-owned vehicle asset association.
//
// Marketplace presentation:
//
//   ┌───────────────┐
//   │               │
//   │  VEHICLE IMG  │   Vehicle
//   │               │   Vehicle image
//   └───────────────┘
//
// Responsibilities:
// - Present that a Journey has a vehicle-role asset.
// - Accept the Journey-owned asset association.
// - Optionally present an already-resolved PublicAsset.
// - Treat assetPublicId strictly as an opaque Asset reference.
// - Keep Asset resolution outside the Journey feature component.
// - Use Next.js Image for optimized image rendering.
// - Use a subtle Lucide vehicle icon for the unresolved state.
//
// This component does NOT:
// - treat assetPublicId as a URL;
// - fetch Asset data;
// - construct Asset URLs;
// - recreate Asset domain data;
// - create or mutate Journey assets;
// - access storageProvider, bucket, objectKey, or internal Asset fields;
// - assume that AssetVisibility.PUBLIC exposes the underlying storage object.
// -----------------------------------------------------------------------------

import Image from "next/image";
import { CarFront } from "lucide-react";

import type { JourneyAsset } from "@/features/journey/models";
import type { PublicAsset } from "@/features/assets/models";

import { cn } from "@/foundation/utils/cn";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyVehicleAssetProps {
  /**
   * Journey-owned asset association.
   *
   * `assetPublicId` remains an opaque Asset public identifier.
   */
  readonly asset: JourneyAsset;

  /**
   * Safe public Asset read model, when already resolved.
   *
   * Asset resolution belongs outside this component.
   */
  readonly publicAsset?: PublicAsset | null;

  /**
   * Optional additional CSS classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyVehicleAsset({
  asset,
  publicAsset,
  className,
}: JourneyVehicleAssetProps) {
  const hasPublicAsset =
    publicAsset !== null && publicAsset !== undefined;

  return (
    <div
      data-asset-public-id={asset.assetPublicId}
      className={cn(
        "flex",
        "min-w-0",
        "items-center",
        "gap-[clamp(0.45rem,0.9vw,0.75rem)]",
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Vehicle Image / Fallback                                            */}
      {/* ------------------------------------------------------------------- */}

      {hasPublicAsset ? (
        <div
          className={cn(
            "relative",
            "size-[clamp(2.35rem,5vw,3.8rem)]",
            "shrink-0",
            "overflow-hidden",
            "rounded-[clamp(0.5rem,0.9vw,0.7rem)]",
            "border",
            "border-[var(--border)]",
            "bg-[var(--background-muted)]",
          )}
        >
          <Image
            src={publicAsset.url}
            alt={publicAsset.alt ?? "Vehicle"}
            fill
            sizes="(max-width: 640px) 38px, 5vw"
            className="object-cover"
          />
        </div>
      ) : (
        <span
          aria-hidden="true"
          className={cn(
            "flex",
            "size-[clamp(2.35rem,5vw,3.8rem)]",
            "shrink-0",
            "items-center",
            "justify-center",
            "rounded-[clamp(0.5rem,0.9vw,0.7rem)]",
            "border",
            "border-[var(--border-subtle)]",
            "bg-[var(--brand-soft)]",
            "text-[var(--brand)]",
          )}
        >
          <CarFront
            className="size-[clamp(1.05rem,2.1vw,1.55rem)]"
          />
        </span>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Vehicle Asset Metadata                                              */}
      {/* ------------------------------------------------------------------- */}

      <div className="min-w-0">
        <p
          className={cn(
            "truncate",
            "text-[clamp(0.58rem,0.95vw,0.78rem)]",
            "font-semibold",
            "leading-tight",
            "text-[var(--foreground)]",
          )}
        >
          Vehicle
        </p>

        <p
          className={cn(
            "mt-[clamp(0.15rem,0.3vw,0.25rem)]",
            "truncate",
            "text-[clamp(0.46rem,0.72vw,0.62rem)]",
            "leading-tight",
            "text-[var(--foreground-muted)]",
          )}
        >
          {hasPublicAsset
            ? "Vehicle image"
            : "Vehicle asset attached"}
        </p>
      </div>
    </div>
  );
}