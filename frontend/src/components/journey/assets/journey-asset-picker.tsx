// -----------------------------------------------------------------------------
// sisiMove — Journey Asset Picker
// -----------------------------------------------------------------------------
//
// Controlled picker for selecting an existing Asset for a Journey.
//
// Asset ownership remains with the Asset feature. This component only selects
// an existing Asset public ID for association with a Journey.
//
// This component does NOT:
// - fetch Assets;
// - upload Assets;
// - delete Assets;
// - create JourneyAsset entities;
// - call the Journey API.
// -----------------------------------------------------------------------------

import { Button } from "@/components/ui";
import type { JourneyAssetType } from "@/features/journey/models";
import { cn } from "@/foundation/utils/cn";

// -----------------------------------------------------------------------------
// Available Asset
// -----------------------------------------------------------------------------

export interface JourneyAssetPickerOption {
  readonly publicId: string;
  readonly label: string;
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyAssetPickerProps {
  readonly options: readonly JourneyAssetPickerOption[];

  readonly selectedAssetPublicId?: string;

  readonly onSelect: (assetPublicId: string) => void;

  readonly assetType?: JourneyAssetType;

  readonly disabled?: boolean;

  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getAssetTypeLabel(type: JourneyAssetType): string {
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

export function JourneyAssetPicker({
  options,
  selectedAssetPublicId,
  onSelect,
  assetType,
  disabled = false,
  className,
}: JourneyAssetPickerProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {assetType && (
        <p className="text-xs text-[var(--foreground-muted)]">
          Select a {getAssetTypeLabel(assetType).toLowerCase()} asset.
        </p>
      )}

      {options.length === 0 ? (
        <p className="text-sm text-[var(--foreground-muted)]">
          No available assets.
        </p>
      ) : (
        <div className="space-y-2">
          {options.map((option) => {
            const selected = option.publicId === selectedAssetPublicId;

            return (
              <Button
                key={option.publicId}
                type="button"
                variant={selected ? "secondary" : "outline"}
                className="w-full justify-start"
                disabled={disabled}
                aria-pressed={selected}
                onClick={() => onSelect(option.publicId)}
              >
                {option.label}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}