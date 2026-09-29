"use client";

// -----------------------------------------------------------------------------
// sisiMove — Journey Asset Item
// -----------------------------------------------------------------------------
//
// Presentation of one Asset associated with a Journey.
//
// Responsibilities:
// - Present the Journey Asset association.
// - Present its type and ordering.
// - Emit optional edit/remove actions supplied by the parent.
//
// This component does NOT:
// - retrieve the Asset;
// - resolve assetPublicId into a URL;
// - upload an Asset;
// - delete an Asset;
// - modify Journey state;
// - recreate Asset-domain behavior.
// -----------------------------------------------------------------------------

import { Button } from "@/components/ui";
import type { JourneyAsset } from "@/features/journey/models";
import { cn } from "@/foundation/utils/cn";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyAssetItemProps {
  readonly asset: JourneyAsset;

  /**
   * Optional human-readable label supplied by the parent.
   *
   * Journey owns the association, while the Asset feature owns the actual
   * Asset metadata. Therefore this component does not resolve the ID itself.
   */
  readonly assetLabel?: string;

  readonly onEdit?: (asset: JourneyAsset) => void;

  readonly onRemove?: (asset: JourneyAsset) => void;

  readonly removing?: boolean;

  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getAssetTypeLabel(type: JourneyAsset["type"]): string {
  switch (type) {
    case "VEHICLE":
      return "Vehicle";
    case "ROUTE":
      return "Route";
    case "OTHER":
      return "Other";
    default:
      return type;
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyAssetItem({
  asset,
  assetLabel,
  onEdit,
  onRemove,
  removing = false,
  className,
}: JourneyAssetItemProps) {
  return (
    <div
      className={cn(
        "flex",
        "items-center",
        "gap-3",
        "rounded-[var(--radius-md)]",
        "border",
        "border-[var(--border)]",
        "p-3",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[var(--foreground)]">
          {assetLabel ?? asset.assetPublicId}
        </p>

        <p className="truncate text-xs text-[var(--foreground-muted)]">
          {getAssetTypeLabel(asset.type)} · Order {asset.sortOrder + 1}
        </p>
      </div>

      {(onEdit || onRemove) && (
        <div className="flex shrink-0 items-center gap-2">
          {onEdit && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={removing}
              onClick={() => onEdit(asset)}
            >
              Edit
            </Button>
          )}

          {onRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={removing}
              loading={removing}
              onClick={() => onRemove(asset)}
            >
              Remove
            </Button>
          )}
        </div>
      )}
    </div>
  );
}