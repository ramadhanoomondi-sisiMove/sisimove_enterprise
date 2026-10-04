// -----------------------------------------------------------------------------
// sisiMove — Journey Vehicle Editor
// -----------------------------------------------------------------------------
//
// Presentation editor for a Journey vehicle.
//
// Responsibilities:
// - maintain local presentation state;
// - collect primitive vehicle values;
// - display the currently selected vehicle Asset;
// - resolve vehicle Asset delivery through the shared Asset capability;
// - open the shared Asset upload flow for vehicle photos;
// - store the returned Asset public ID in the local vehicle form state;
// - emit vehicle values through onSubmit.
//
// Asset ownership:
// - AssetUploadDialog owns physical file selection and upload;
// - this editor only assigns the returned Asset public ID to the vehicle form;
// - usePublicAsset resolves the public Asset representation for presentation;
// - Journey still owns only the opaque assetPublicId reference;
// - removing/changing the photo does not delete the previous Asset.
//
// Important state rule:
//
//   JourneyVehicleEditor
//          │
//          └── vehicle values = source of truth
//                    │
//                    ├── make
//                    ├── model
//                    ├── year
//                    ├── color
//                    ├── registration
//                    └── assetPublicId
//
// The uploaded Asset object itself is NOT stored in local state.
//
// When a new Asset is uploaded:
//
//   AssetUploadDialog
//          │
//          │ Asset.publicId
//          ▼
//   values.assetPublicId
//          │
//          ▼
//   usePublicAsset(assetPublicId)
//          │
//          │ public Asset { url, alt, ... }
//          ▼
//   JourneyVehicleFields
//
// This follows the same Asset delivery pattern used by ProfilePageContainer.
//
// This component does NOT:
// - call the Journey API;
// - upload Assets directly;
// - construct Asset URLs;
// - construct domain value objects;
// - convert year into a number;
// - validate vehicle/domain invariants;
// - decide whether the Journey may attach or replace its vehicle.
//
// The owning Journey workflow remains responsible for translating the submitted
// primitive values into the Journey vehicle command.
//
// -----------------------------------------------------------------------------

"use client";

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import {
  FormEvent,
  useState,
} from "react";

// -----------------------------------------------------------------------------
// Asset Upload
// -----------------------------------------------------------------------------

import {
  AssetUploadDialog,
} from "@/components/assets";

// -----------------------------------------------------------------------------
// UI
// -----------------------------------------------------------------------------

import {
  Button,
} from "@/components/ui";

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import {
  cn,
} from "@/foundation";

// -----------------------------------------------------------------------------
// Assets
// -----------------------------------------------------------------------------
//
// Asset is used only for the upload callback.
//
// Public Asset delivery is resolved through usePublicAsset.
// -----------------------------------------------------------------------------

import {
  usePublicAsset,
  type Asset,
  type AssetUploadCategory,
  type AssetUploadType,
} from "@/features/assets";

// -----------------------------------------------------------------------------
// Vehicle Fields
// -----------------------------------------------------------------------------

import {
  JourneyVehicleFields,
  type JourneyVehicleAssetOption,
  type JourneyVehicleFieldValues,
} from "./journey-vehicle-fields";

// =============================================================================
// Types
// =============================================================================

export interface JourneyVehicleEditorProps {
  /**
   * Initial values are read once when the editor mounts.
   */
  readonly initialValue?: Partial<JourneyVehicleFieldValues>;

  /**
   * The currently resolved vehicle Asset supplied by the owning Journey
   * projection.
   *
   * This remains the fallback presentation reference for the Asset already
   * attached to the Journey.
   */
  readonly selectedAsset?: JourneyVehicleAssetOption | null;

  /**
   * Presentation-only submission boundary.
   */
  readonly onSubmit: (
    values: JourneyVehicleFieldValues,
  ) => void;

  readonly onCancel?: () => void;

  readonly submitting?: boolean;

  readonly submitLabel?: string;

  readonly className?: string;
}

// =============================================================================
// Defaults
// =============================================================================

const EMPTY_VALUES: JourneyVehicleFieldValues = {
  make: "",
  model: "",
  year: "",
  color: "",
  registration: "",
  assetPublicId: "",
};

// =============================================================================
// Asset Configuration
// =============================================================================
//
// The Journey vehicle only retains the Asset public ID.
//
// AssetUploadDialog remains responsible for:
// - physical file selection;
// - file validation;
// - Asset upload;
// - Asset persistence;
// - upload errors.
//
// This editor only gives the uploaded Asset its vehicle-specific meaning by
// storing its public ID in the vehicle form state.
// =============================================================================

const VEHICLE_ASSET_CATEGORY: AssetUploadCategory =
  "VEHICLE_PHOTO";

const VEHICLE_ASSET_TYPE: AssetUploadType =
  "IMAGE";

const VEHICLE_ASSET_ACCEPT =
  "image/*";

// =============================================================================
// Component
// =============================================================================

export function JourneyVehicleEditor({
  initialValue,
  selectedAsset = null,
  onSubmit,
  onCancel,
  submitting = false,
  submitLabel = "Save vehicle",
  className,
}: JourneyVehicleEditorProps) {
  // ===========================================================================
  // Vehicle Form State
  // ===========================================================================
  //
  // This is the only local copy of vehicle values.
  //
  // The form state remains the source of truth, exactly like JourneyCreateVehicle.
  // In particular, assetPublicId changes immediately after an Asset upload.
  //
  // ===========================================================================

  const [values, setValues] =
    useState<JourneyVehicleFieldValues>(() => ({
      make:
        initialValue?.make ??
        EMPTY_VALUES.make,

      model:
        initialValue?.model ??
        EMPTY_VALUES.model,

      year:
        initialValue?.year ??
        EMPTY_VALUES.year,

      color:
        initialValue?.color ??
        EMPTY_VALUES.color,

      registration:
        initialValue?.registration ??
        EMPTY_VALUES.registration,

      assetPublicId:
        initialValue?.assetPublicId ??
        EMPTY_VALUES.assetPublicId,
    }));

  // ===========================================================================
  // Asset Upload Dialog State
  // ===========================================================================

  const [
    isAssetUploadOpen,
    setIsAssetUploadOpen,
  ] = useState(false);

  // ===========================================================================
  // Selected Asset Public ID
  // ===========================================================================
  //
  // The vehicle form owns the current Asset reference.
  //
  // This is important because a newly uploaded Asset changes this value before
  // the Journey itself has been saved.
  //
  // Therefore the editor can resolve and display the newly uploaded Asset
  // immediately without requiring a Journey refetch.
  //
  // ===========================================================================

  const selectedAssetPublicId =
    values.assetPublicId.trim();

  // ===========================================================================
  // Public Asset Resolution
  // ===========================================================================
  //
  // AssetUploadDialog returns the persisted Asset reference.
  //
  // It does not provide the public delivery URL used by the presentation layer.
  //
  // usePublicAsset is the established Asset delivery boundary and is the same
  // pattern used by ProfilePageContainer.
  //
  // ===========================================================================

  const {
    asset: resolvedAsset,
  } = usePublicAsset(
    selectedAssetPublicId.length > 0
      ? selectedAssetPublicId
      : null,
  );

  // ===========================================================================
  // Presentation Asset
  // ===========================================================================
  //
  // Prefer the Asset resolved from the current form state.
  //
  // This handles both:
  //
  // 1. Existing Journey vehicle photo
  //    - values.assetPublicId
  //    - usePublicAsset(...)
  //
  // 2. Newly uploaded vehicle photo
  //    - AssetUploadDialog returns publicId
  //    - values.assetPublicId changes
  //    - usePublicAsset(...) resolves the new Asset
  //
  // The existing selectedAsset supplied by the Journey projection is retained
  // as a fallback while the public Asset query is resolving.
  //
  // ===========================================================================

  const presentationAsset: JourneyVehicleAssetOption | null =
    resolvedAsset !== null &&
    resolvedAsset !== undefined &&
    resolvedAsset.publicId ===
      selectedAssetPublicId
      ? {
          publicId:
            resolvedAsset.publicId,

          url:
            resolvedAsset.url,

          label:
            resolvedAsset.alt ??
            "Vehicle photo",
        }
      : selectedAsset;

  // ===========================================================================
  // Field Update
  // ===========================================================================

  /**
   * Update one presentation field.
   *
   * Values intentionally remain strings until the owning workflow submits
   * them. In particular, an empty year must not become zero through
   * Number("").
   */
  function updateField(
    field: keyof JourneyVehicleFieldValues,
    value: string,
  ): void {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // ===========================================================================
  // Asset Upload
  // ===========================================================================

  /**
   * Open the shared vehicle-photo Asset upload flow.
   */
  function handleChangeAsset(): void {
    if (submitting) {
      return;
    }

    setIsAssetUploadOpen(true);
  }

  /**
   * Receive the persisted Asset from AssetUploadDialog.
   *
   * Only the opaque public ID crosses into Journey vehicle state.
   *
   * The Asset URL is deliberately NOT read here.
   *
   * Updating assetPublicId causes usePublicAsset to resolve the Asset and
   * JourneyVehicleFields then receives the resolved public URL.
   */
  function handleAssetUploaded(
    asset: Asset,
  ): void {
    updateField(
      "assetPublicId",
      asset.publicId,
    );
  }

  // ===========================================================================
  // Submit
  // ===========================================================================

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    onSubmit(values);
  }

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={cn(
          "w-full",
          "space-y-5",
          className,
        )}
      >
        <JourneyVehicleFields
          values={values}
          onChange={updateField}
          selectedAsset={presentationAsset}
          onChangeAsset={handleChangeAsset}
          disabled={submitting}
        />

        <div
          className={cn(
            "flex",
            "flex-col-reverse",
            "gap-3",
            "sm:flex-row",
            "sm:items-center",
            "sm:justify-end",
          )}
        >
          {onCancel !== undefined && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            variant="primary"
            loading={submitting}
          >
            {submitLabel}
          </Button>
        </div>
      </form>

      {/* --------------------------------------------------------------------- */}
      {/* Vehicle Asset Upload                                                 */}
      {/* --------------------------------------------------------------------- */}

      {isAssetUploadOpen && (
        <AssetUploadDialog
          open={isAssetUploadOpen}
          onOpenChange={setIsAssetUploadOpen}
          category={VEHICLE_ASSET_CATEGORY}
          type={VEHICLE_ASSET_TYPE}
          title="Upload vehicle photo"
          description="Choose a clear photo of the vehicle you will use for this journey."
          accept={VEHICLE_ASSET_ACCEPT}
          onUploaded={handleAssetUploaded}
        />
      )}
    </>
  );
}