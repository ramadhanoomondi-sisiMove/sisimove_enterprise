// -----------------------------------------------------------------------------
// sisiMove — Journey Create Assets
// -----------------------------------------------------------------------------
//
// Presentation-only creation step for associating Assets with a Journey.
//
// Responsibilities:
// - display available Asset references supplied by the parent;
// - allow the user to select an Asset;
// - collect the Journey asset type;
// - collect the display/order position;
// - emit primitive values through onChange.
//
// The parent JourneyCreateForm owns:
// - Asset loading through the Asset capability;
// - validation;
// - attachJourneyAsset();
// - removal/replacement of Journey asset associations;
// - persistence errors;
// - navigation/publishing.
//
// This component does NOT:
// - upload Assets;
// - delete Assets;
// - replace Assets;
// - resolve Asset URLs;
// - call the Asset API;
// - call the Journey API.
//
// `assetPublicId` remains an opaque cross-feature reference.
// -----------------------------------------------------------------------------

import type { JourneyAssetType } from "@/features/journey/models";
import { Select } from "@/components/ui/select";
import { cn } from "@/foundation/utils/cn";

export interface JourneyCreateAssetValues {
  readonly assetPublicId: string;
  readonly type: JourneyAssetType;
  readonly sortOrder: string;
}

export interface JourneyCreateAssetOption {
  readonly publicId: string;
  readonly label: string;
}

export interface JourneyCreateAssetsProps {
  readonly values: JourneyCreateAssetValues;
  readonly options: readonly JourneyCreateAssetOption[];
  readonly onChange: (
    field: keyof JourneyCreateAssetValues,
    value: string,
  ) => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

const JOURNEY_ASSET_TYPE_OPTIONS: readonly {
  readonly value: JourneyAssetType;
  readonly label: string;
}[] = [
  {
    value: "VEHICLE",
    label: "Vehicle",
  },
  {
    value: "ROUTE",
    label: "Route",
  },
  {
    value: "OTHER",
    label: "Other",
  },
];

export function JourneyCreateAssets({
  values,
  options,
  onChange,
  disabled = false,
  className,
}: JourneyCreateAssetsProps) {
  return (
    <section
      aria-labelledby="journey-create-assets-title"
      className={cn("space-y-6", className)}
    >
      <div className="space-y-1">
        <h2
          id="journey-create-assets-title"
          className="text-lg font-semibold text-[var(--foreground)]"
        >
          Add journey photos
        </h2>

        <p className="text-sm text-[var(--foreground-secondary)]">
          Optionally associate photos or other assets with this journey.
        </p>
      </div>

      {options.length > 0 ? (
        <div className="space-y-5">
          <Select
            label="Asset"
            value={values.assetPublicId}
            onChange={(event) =>
              onChange("assetPublicId", event.target.value)
            }
            disabled={disabled}
            fullWidth
          >
            <option value="">Select an asset</option>

            {options.map((option) => (
              <option key={option.publicId} value={option.publicId}>
                {option.label}
              </option>
            ))}
          </Select>

          <Select
            label="Asset type"
            value={values.type}
            onChange={(event) =>
              onChange("type", event.target.value)
            }
            disabled={disabled}
            fullWidth
          >
            {JOURNEY_ASSET_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <div className="max-w-xs">
            <label
              htmlFor="journey-create-asset-sort-order"
              className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
            >
              Display order
            </label>

            <input
              id="journey-create-asset-sort-order"
              type="number"
              min="0"
              inputMode="numeric"
              value={values.sortOrder}
              onChange={(event) =>
                onChange("sortOrder", event.target.value)
              }
              disabled={disabled}
              className={cn(
                "block w-full",
                "rounded-[var(--radius-md)]",
                "border border-[var(--border)]",
                "bg-[var(--background)]",
                "px-3 py-2",
                "text-sm text-[var(--foreground)]",
                "outline-none",
                "focus:border-[var(--brand)]",
                "focus:ring-2",
                "focus:ring-[var(--brand)]/20",
                "disabled:cursor-not-allowed",
                "disabled:bg-[var(--background-muted)]",
              )}
            />

            <p className="mt-1.5 text-xs text-[var(--foreground-muted)]">
              Lower numbers appear first.
            </p>
          </div>
        </div>
      ) : (
        <div className="surface-muted p-5">
          <p className="text-sm font-medium text-[var(--foreground)]">
            No assets available
          </p>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            You can continue without adding an asset and add one later.
          </p>
        </div>
      )}
    </section>
  );
}