"use client";

// -----------------------------------------------------------------------------
// sisiMove — Journey Asset List
// -----------------------------------------------------------------------------
//
// Presentation collection for Journey Asset associations.
//
// Responsibilities:
// - Render the supplied Journey Assets.
// - Preserve the supplied order.
// - Delegate item actions to the parent.
//
// This component does NOT:
// - sort Assets;
// - retrieve Asset metadata;
// - upload or delete Assets;
// - persist Journey state.
// -----------------------------------------------------------------------------

import { EmptyState } from "@/components/ui";
import type { JourneyAsset } from "@/features/journey/models";
import { cn } from "@/foundation/utils/cn";

import { JourneyAssetItem } from "./journey-asset-item";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyAssetListProps {
  readonly assets: readonly JourneyAsset[];

  readonly assetLabels?: Readonly<Record<string, string>>;

  readonly onEdit?: (asset: JourneyAsset) => void;

  readonly onRemove?: (asset: JourneyAsset) => void;

  readonly removingAssetPublicId?: string | null;

  readonly emptyTitle?: string;

  readonly emptyDescription?: string;

  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyAssetList({
  assets,
  assetLabels,
  onEdit,
  onRemove,
  removingAssetPublicId = null,
  emptyTitle = "No journey assets",
  emptyDescription = "Assets associated with this Journey will appear here.",
  className,
}: JourneyAssetListProps) {
  if (assets.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        className={className}
      />
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {assets.map((asset) => (
        <JourneyAssetItem
          key={asset.publicId}
          asset={asset}
          assetLabel={assetLabels?.[asset.assetPublicId]}
          onEdit={onEdit}
          onRemove={onRemove}
          removing={removingAssetPublicId === asset.publicId}
        />
      ))}
    </div>
  );
}