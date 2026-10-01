// -----------------------------------------------------------------------------
// sisiMove — Journey Vehicle Fields
// -----------------------------------------------------------------------------
//
// Presentation-only fields for a Journey vehicle.
//
// The component owns no form state and performs no API mutation.
//
// Vehicle values remain primitive presentation values. The owning workflow
// validates and converts them before invoking the Journey vehicle command.
//
// Asset selection is presentation-only. The component receives already
// resolved Asset references from the owning workflow and never constructs
// Asset URLs or performs uploads.
//
// -----------------------------------------------------------------------------

"use client";

import Image from "next/image";

import { Input } from "@/components/ui";
import { cn } from "@/foundation";

// =============================================================================
// Types
// =============================================================================

export interface JourneyVehicleAssetOption {
  readonly publicId: string;
  readonly url: string;
  readonly label?: string;
}

export interface JourneyVehicleFieldValues {
  readonly make: string;
  readonly model: string;
  readonly year: string;
  readonly color: string;
  readonly registration: string;
  readonly assetPublicId: string;
}

export interface JourneyVehicleFieldsProps {
  readonly values: JourneyVehicleFieldValues;

  readonly onChange: (
    field: keyof JourneyVehicleFieldValues,
    value: string,
  ) => void;

  /**
   * The currently resolved vehicle Asset, if one is attached.
   *
   * The URL is supplied by the Asset capability's public delivery boundary.
   * This component never constructs or derives the URL itself.
   */
  readonly selectedAsset?: JourneyVehicleAssetOption | null;

  /**
   * Called when the user wants to upload or replace the vehicle photo.
   *
   * The owning workflow is responsible for opening the appropriate Asset
   * workflow. This component only presents the action.
   */
  readonly onChangeAsset?: () => void;

  readonly disabled?: boolean;

  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyVehicleFields({
  values,
  onChange,
  selectedAsset = null,
  onChangeAsset,
  disabled = false,
  className,
}: JourneyVehicleFieldsProps) {
  const vehicleLabel =
    `${values.make} ${values.model}`.trim() || "Vehicle";

  const hasVehiclePhoto =
    selectedAsset !== null &&
    selectedAsset.url.trim().length > 0;

  return (
    <div
      className={cn(
        "w-full",
        "space-y-5",
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Vehicle image                                                       */}
      {/* ------------------------------------------------------------------- */}

      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-[var(--foreground)]">
            Vehicle photo
          </p>

          <p className="mt-1 text-sm leading-5 text-[var(--foreground-muted)]">
            This photo will represent your vehicle on the Journey.
          </p>
        </div>

        <div
          className={cn(
            "overflow-hidden",
            "rounded-[var(--radius-lg)]",
            "border",
            "border-[var(--border)]",
            "bg-[var(--background-subtle)]",
          )}
        >
          {hasVehiclePhoto ? (
            <div className="relative aspect-video w-full">
              <Image
                src={selectedAsset.url}
                alt={selectedAsset.label ?? vehicleLabel}
                fill
                sizes="(max-width: 640px) 100vw, 640px"
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex aspect-video w-full items-center justify-center px-6 text-center">
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  No vehicle photo selected
                </p>

                <p className="mt-1 text-sm leading-5 text-[var(--foreground-muted)]">
                  Add a vehicle photo before publishing your Journey.
                </p>
              </div>
            </div>
          )}
        </div>

        {onChangeAsset !== undefined && (
          <button
            type="button"
            onClick={onChangeAsset}
            disabled={disabled}
            className={cn(
              "inline-flex",
              "min-h-10",
              "items-center",
              "justify-center",
              "rounded-[var(--radius-md)]",
              "border",
              "border-[var(--border)]",
              "bg-[var(--surface)]",
              "px-4",
              "py-2",
              "text-sm",
              "font-medium",
              "text-[var(--foreground)]",
              "transition-colors",
              "hover:bg-[var(--background-subtle)]",
              "focus-visible:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-[var(--brand)]",
              "disabled:pointer-events-none",
              "disabled:opacity-50",
            )}
          >
            {hasVehiclePhoto
              ? "Change vehicle photo"
              : "Add vehicle photo"}
          </button>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Vehicle identity                                                    */}
      {/* ------------------------------------------------------------------- */}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          label="Make"
          value={values.make}
          onChange={(event) => {
            onChange("make", event.target.value);
          }}
          placeholder="e.g. Toyota"
          disabled={disabled}
          fullWidth
        />

        <Input
          label="Model"
          value={values.model}
          onChange={(event) => {
            onChange("model", event.target.value);
          }}
          placeholder="e.g. Noah"
          disabled={disabled}
          fullWidth
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          label="Year"
          type="text"
          inputMode="numeric"
          value={values.year}
          onChange={(event) => {
            onChange("year", event.target.value);
          }}
          placeholder="e.g. 2022"
          helperText="Optional."
          disabled={disabled}
          fullWidth
        />

        <Input
          label="Color"
          value={values.color}
          onChange={(event) => {
            onChange("color", event.target.value);
          }}
          placeholder="e.g. White"
          helperText="Optional."
          disabled={disabled}
          fullWidth
        />
      </div>

      <Input
        label="Registration"
        value={values.registration}
        onChange={(event) => {
          onChange("registration", event.target.value);
        }}
        placeholder="e.g. KDA 123A"
        helperText="Keep this information private until the appropriate trust boundary."
        disabled={disabled}
        fullWidth
      />
    </div>
  );
}