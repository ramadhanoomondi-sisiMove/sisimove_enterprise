// -----------------------------------------------------------------------------
// sisiMove — Journey Create Vehicle
// -----------------------------------------------------------------------------
//
// Presentation step for collecting Journey vehicle information.
//
// Responsibilities:
// - collect vehicle make/model;
// - collect optional year, color, and registration;
// - create/upload the vehicle photo through the shared Asset capability;
// - retain the uploaded Asset public ID through the parent form state;
// - emit primitive vehicle values through onChange;
// - render the existing UI primitives.
//
// Important state rule:
//
//   JourneyCreateForm
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
// This component intentionally does NOT keep a second copy of vehicle form
// values in local state.
//
// The uploaded Asset object itself is not required to remember the step.
// The persisted assetPublicId is sufficient to restore the uploaded state when
// this component is remounted.
//
// Asset ownership remains outside the Journey domain. This component delegates
// physical file handling to AssetUploadDialog and stores only the resulting
// Asset public ID in the Journey creation workflow.
//
// Flow:
//
//   Vehicle details
//        +
//   Vehicle photo
//        │
//        ▼
//   AssetUploadDialog
//        │
//        ▼
//   Asset capability
//        │
//        ▼
//   persisted READY Asset
//        │
//        ▼
//   assetPublicId
//        │
//        ▼
//   JourneyCreateForm state
//        │
//        ▼
//   AttachJourneyVehicle
//        │
//        ▼
//   JourneyVehicle
//
// Registration is collected because it belongs to the authenticated Journey
// vehicle command. Public Journey projections must still respect the separate
// privacy boundary.
//
// -----------------------------------------------------------------------------
// Asset responsibility
// -----------------------------------------------------------------------------
//
// AssetUploadDialog is responsible for:
// - physical file selection;
// - file validation;
// - Asset creation/upload;
// - Asset persistence;
// - upload errors;
// - waiting for the consuming callback before closing.
//
// This component only coordinates the vehicle-specific meaning of that Asset.
//
// Removing the photo from this form only clears the Journey draft reference.
// It does NOT delete the Asset itself.
// -----------------------------------------------------------------------------

"use client";

import { useState } from "react";

import { AssetUploadDialog } from "@/components/assets";

import { Input } from "@/components/ui/input";

import { cn } from "@/foundation/utils/cn";

import type {
  Asset,
  AssetUploadCategory,
  AssetUploadType,
} from "@/features/assets";

// =============================================================================
// Types
// =============================================================================

export interface JourneyCreateVehicleValues {
  readonly make: string;
  readonly model: string;
  readonly year: string;
  readonly color: string;
  readonly registration: string;
  readonly assetPublicId: string;
}

export interface JourneyCreateVehicleProps {
  readonly values: JourneyCreateVehicleValues;

  readonly onChange: (
    field: keyof JourneyCreateVehicleValues,
    value: string,
  ) => void;

  readonly disabled?: boolean;

  readonly className?: string;
}

// =============================================================================
// Asset Configuration
// =============================================================================
//
// The vehicle photo is an Asset-domain concern.
//
// Journey does not own the Asset itself. It only retains the Asset public ID
// as an opaque reference.
//
// No type assertions are required here.
// =============================================================================

const VEHICLE_ASSET_CATEGORY: AssetUploadCategory = "VEHICLE_PHOTO";

const VEHICLE_ASSET_TYPE: AssetUploadType = "IMAGE";

// =============================================================================
// Component
// =============================================================================

export function JourneyCreateVehicle({
  values,
  onChange,
  disabled = false,
  className,
}: JourneyCreateVehicleProps) {
  // ---------------------------------------------------------------------------
  // Upload dialog
  // ---------------------------------------------------------------------------

  const [isAssetUploadOpen, setIsAssetUploadOpen] = useState(false);

  // ---------------------------------------------------------------------------
  // Uploaded Asset state
  // ---------------------------------------------------------------------------
  //
  // JourneyCreateForm remains the source of truth.
  //
  // The existence of assetPublicId means:
  //
  //   Asset has been uploaded
  //   +
  //   Asset public ID has been attached to the current form state
  //
  // No Asset object is duplicated in local component state.
  // ---------------------------------------------------------------------------

  const hasUploadedAsset =
    values.assetPublicId.trim().length > 0;

  // ---------------------------------------------------------------------------
  // Asset uploaded
  // ---------------------------------------------------------------------------
  //
  // AssetUploadDialog has already completed the Asset upload before invoking
  // this callback.
  //
  // The returned Asset therefore supplies the persisted public ID that the
  // Journey vehicle command will later reference.
  // ---------------------------------------------------------------------------

  function handleAssetUploaded(asset: Asset): void {
    onChange(
      "assetPublicId",
      asset.publicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Remove uploaded Asset reference
  // ---------------------------------------------------------------------------
  //
  // This does NOT delete the Asset.
  //
  // It only removes the Asset reference from the Journey creation workflow.
  //
  // Actual Asset lifecycle operations remain owned by the Asset capability.
  // ---------------------------------------------------------------------------

  function handleRemoveAsset(): void {
    onChange(
      "assetPublicId",
      "",
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <section
      aria-labelledby="journey-create-vehicle-title"
      className={cn(
        "space-y-6",
        className,
      )}
    >
      {/* ----------------------------------------------------------------- */}
      {/* Heading                                                           */}
      {/* ----------------------------------------------------------------- */}

      <div className="space-y-1">
        <h2
          id="journey-create-vehicle-title"
          className="text-lg font-semibold text-[var(--foreground)]"
        >
          What vehicle are you travelling in?
        </h2>

        <p className="text-sm text-[var(--foreground-secondary)]">
          Add your vehicle details and upload a photo so passengers can
          identify the journey.
        </p>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Vehicle Details                                                   */}
      {/* ----------------------------------------------------------------- */}

      <div className="space-y-5">
        {/* --------------------------------------------------------------- */}
        {/* Make / Model                                                    */}
        {/* --------------------------------------------------------------- */}

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Make"
            value={values.make}
            onChange={(event) =>
              onChange(
                "make",
                event.target.value,
              )
            }
            placeholder="e.g. Toyota"
            disabled={disabled}
            autoComplete="off"
            fullWidth
          />

          <Input
            label="Model"
            value={values.model}
            onChange={(event) =>
              onChange(
                "model",
                event.target.value,
              )
            }
            placeholder="e.g. Noah"
            disabled={disabled}
            autoComplete="off"
            fullWidth
          />
        </div>

        {/* --------------------------------------------------------------- */}
        {/* Year / Color                                                    */}
        {/* --------------------------------------------------------------- */}

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Year"
            value={values.year}
            onChange={(event) =>
              onChange(
                "year",
                event.target.value,
              )
            }
            placeholder="e.g. 2022"
            inputMode="numeric"
            disabled={disabled}
            autoComplete="off"
            helperText="Optional"
            fullWidth
          />

          <Input
            label="Color"
            value={values.color}
            onChange={(event) =>
              onChange(
                "color",
                event.target.value,
              )
            }
            placeholder="e.g. White"
            disabled={disabled}
            autoComplete="off"
            helperText="Optional"
            fullWidth
          />
        </div>

        {/* --------------------------------------------------------------- */}
        {/* Registration                                                    */}
        {/* --------------------------------------------------------------- */}

        <Input
          label="Registration"
          value={values.registration}
          onChange={(event) =>
            onChange(
              "registration",
              event.target.value,
            )
          }
          placeholder="e.g. KDA 123A"
          disabled={disabled}
          autoComplete="off"
          helperText="Optional"
          fullWidth
        />

        {/* --------------------------------------------------------------- */}
        {/* Vehicle Photo                                                   */}
        {/* --------------------------------------------------------------- */}

        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-[var(--foreground)]">
              Vehicle photo
            </h3>

            <p className="text-xs text-[var(--foreground-muted)]">
              Upload a clear photo of the vehicle. A vehicle photo is required
              before continuing.
            </p>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* No uploaded Asset                                             */}
          {/* ------------------------------------------------------------- */}

          {!hasUploadedAsset ? (
            <button
              type="button"
              onClick={() =>
                setIsAssetUploadOpen(true)
              }
              disabled={disabled}
              className={cn(
                "flex",
                "min-h-32",
                "w-full",
                "cursor-pointer",
                "flex-col",
                "items-center",
                "justify-center",
                "gap-2",
                "rounded-[var(--radius-lg)]",
                "border-2",
                "border-dashed",
                "border-[var(--border-strong)]",
                "bg-[var(--background-subtle)]",
                "px-6",
                "py-6",
                "text-center",
                "transition-colors",
                "duration-150",
                "ease-out",
                "hover:border-[var(--brand)]",
                "hover:bg-[var(--brand-soft)]",
                "disabled:cursor-not-allowed",
                "disabled:opacity-60",
              )}
            >
              <span
                className={cn(
                  "flex",
                  "h-10",
                  "w-10",
                  "items-center",
                  "justify-center",
                  "rounded-[var(--radius-full)]",
                  "bg-[var(--brand-soft)]",
                  "text-[var(--brand)]",
                )}
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    d="M10 13V4m0 0L6.5 7.5M10 4l3.5 3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M4.5 11.5v3A1.5 1.5 0 0 0 6 16h8a1.5 1.5 0 0 0 1.5-1.5v-3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>

              <span className="text-sm font-medium text-[var(--foreground)]">
                Upload vehicle photo
              </span>

              <span className="text-xs text-[var(--foreground-muted)]">
                The photo must be uploaded before continuing.
              </span>
            </button>
          ) : (
            /* ------------------------------------------------------------- */
            /* Uploaded Asset                                                */
            /* ------------------------------------------------------------- */

            <div
              className={cn(
                "rounded-[var(--radius-lg)]",
                "border",
                "border-[var(--border)]",
                "bg-[var(--background-subtle)]",
                "p-4",
              )}
            >
              <div className="flex items-start gap-3">
                {/* ------------------------------------------------------- */}
                {/* Asset icon                                               */}
                {/* ------------------------------------------------------- */}

                <div
                  className={cn(
                    "flex",
                    "h-10",
                    "w-10",
                    "shrink-0",
                    "items-center",
                    "justify-center",
                    "rounded-[var(--radius-md)]",
                    "bg-[var(--brand-soft)]",
                    "text-[var(--brand)]",
                  )}
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="14"
                      height="14"
                      rx="2"
                    />

                    <circle
                      cx="7"
                      cy="7"
                      r="1.25"
                    />

                    <path
                      d="m4.5 15 4-4 2.5 2.5 1.5-1.5 3 3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* ------------------------------------------------------- */}
                {/* Asset reference                                         */}
                {/* ------------------------------------------------------- */}

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    Vehicle photo uploaded
                  </p>

                  <p className="mt-1 truncate text-xs text-[var(--foreground-muted)]">
                    {values.assetPublicId}
                  </p>
                </div>

                {/* ------------------------------------------------------- */}
                {/* Remove reference                                        */}
                {/* ------------------------------------------------------- */}

                <button
                  type="button"
                  onClick={handleRemoveAsset}
                  disabled={disabled}
                  className={cn(
                    "text-sm",
                    "font-medium",
                    "text-[var(--foreground-secondary)]",
                    "transition-colors",
                    "hover:text-[var(--danger)]",
                    "disabled:cursor-not-allowed",
                    "disabled:opacity-60",
                  )}
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Asset Upload Dialog                                               */}
      {/* ----------------------------------------------------------------- */}

      <AssetUploadDialog
        open={isAssetUploadOpen}
        onOpenChange={setIsAssetUploadOpen}
        category={VEHICLE_ASSET_CATEGORY}
        type={VEHICLE_ASSET_TYPE}
        title="Upload vehicle photo"
        description="Choose a clear photo of the vehicle you will use for this journey."
        accept="image/*"
        onUploaded={handleAssetUploaded}
      />
    </section>
  );
}