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
// `assetPublicId` is an opaque reference to an Asset. This component does not
// construct an Asset URL or upload an Asset.
//
// -----------------------------------------------------------------------------

"use client";

import { Input } from "@/components/ui";
import { cn } from "@/foundation";

// =============================================================================
// Types
// =============================================================================

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

  readonly disabled?: boolean;

  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyVehicleFields({
  values,
  onChange,
  disabled = false,
  className,
}: JourneyVehicleFieldsProps) {
  return (
    <div
      className={cn(
        "space-y-5",
        className,
      )}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

      <Input
        label="Vehicle asset ID"
        value={values.assetPublicId}
        onChange={(event) => {
          onChange("assetPublicId", event.target.value);
        }}
        placeholder="Optional Asset public ID"
        helperText="Reference an existing Asset. Uploading and managing Assets belongs to the Assets feature."
        disabled={disabled}
        fullWidth
      />
    </div>
  );
}