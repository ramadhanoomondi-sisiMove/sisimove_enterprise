// -----------------------------------------------------------------------------
// sisiMove — Journey Vehicle Asset
// -----------------------------------------------------------------------------
//
// Presentation of a Journey-owned vehicle asset association.
//
// Responsibilities:
// - Present that a Journey has a vehicle-role asset.
// - Accept the Journey-owned asset association.
// - Optionally present an already-resolved PublicAsset.
// - Treat assetPublicId strictly as an opaque Asset reference.
// - Keep Asset resolution outside the Journey feature component.
// - Use Next.js Image for optimized image rendering.
//
// Asset boundary:
// - JourneyAsset identifies the association owned by Journey.
// - PublicAsset provides the safe renderable URL and accessible alt text.
// - The Asset bounded context remains responsible for resolving PublicAsset.
//
// This component does NOT:
// - treat assetPublicId as a URL;
// - fetch Asset data;
// - construct Asset URLs;
// - recreate Asset domain data;
// - create or mutate Journey assets;
// - access storageProvider, bucket, objectKey, or internal Asset fields;
// - assume that AssetVisibility.PUBLIC exposes the underlying storage object.
//
// -----------------------------------------------------------------------------
//
// JourneyAsset
//      │
//      │ assetPublicId
//      ▼
// Asset bounded context
//      │
//      │ PublicAsset
//      ▼
// JourneyVehicleAsset
//      │
//      ├── optimized image
//      └── accessible alt text
//
// -----------------------------------------------------------------------------

import Image from "next/image";

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
   * This identifies the Asset associated with the Journey and describes its
   * Journey-specific role.
   *
   * `asset.assetPublicId` remains an opaque Asset public identifier.
   */
  readonly asset: JourneyAsset;

  /**
   * Safe public Asset read model, when the Asset has already been resolved.
   *
   * Asset resolution belongs outside this component. The component therefore
   * never fetches an Asset by itself.
   *
   * When omitted or null, the component renders the vehicle-asset placeholder.
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
  /**
   * The JourneyAsset association is deliberately kept separate from the
   * resolved PublicAsset.
   *
   * `assetPublicId` is never converted into a URL by the Journey feature.
   */
  const hasPublicAsset =
    publicAsset !== null && publicAsset !== undefined;

  return (
    <div
      data-asset-public-id={asset.assetPublicId}
      className={cn(
        "flex",
        "min-w-0",
        "items-center",
        "gap-2",
        className,
      )}
    >
      {hasPublicAsset ? (
        <div
          className={cn(
            "relative",
            "size-12",
            "shrink-0",
            "overflow-hidden",
            "rounded-[var(--radius-md)]",
            "border",
            "border-[var(--border)]",
            "bg-[var(--background-muted)]",
          )}
        >
          <Image
            src={publicAsset.url}
            alt={publicAsset.alt ?? "Vehicle"}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>
      ) : (
        <span
          aria-hidden="true"
          className={cn(
            "flex",
            "size-12",
            "shrink-0",
            "items-center",
            "justify-center",
            "rounded-[var(--radius-md)]",
            "bg-[var(--brand-soft)]",
            "text-[var(--brand)]",
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 17h14M6.5 17V9.5A2.5 2.5 0 0 1 9 7h6a2.5 2.5 0 0 1 2.5 2.5V17M8 17v2m8-2v2M7 12h10"
            />
          </svg>
        </span>
      )}

      <div className="min-w-0">
        <p className="text-sm font-medium text-[var(--foreground)]">
          Vehicle
        </p>

        <p className="truncate text-xs text-[var(--foreground-muted)]">
          {hasPublicAsset ? "Vehicle image" : "Vehicle asset attached"}
        </p>
      </div>
    </div>
  );
}