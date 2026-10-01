// -----------------------------------------------------------------------------
// sisiMove — Journey Vehicle Editor
// -----------------------------------------------------------------------------
//
// Presentation-only editor for a Journey vehicle.
//
// Responsibilities:
// - maintain local presentation state;
// - collect primitive vehicle values;
// - display the currently selected vehicle Asset;
// - allow the owning workflow to initiate Asset replacement;
// - emit vehicle values through onSubmit.
//
// This component does NOT:
// - call the Journey API;
// - upload Assets;
// - construct Asset URLs;
// - construct domain value objects;
// - convert year into a number;
// - validate vehicle/domain invariants;
// - decide whether the Journey may attach or replace its vehicle.
//
// The Asset capability remains responsible for uploading and resolving Assets.
// The owning Journey workflow remains responsible for translating the selected
// Asset into the Journey vehicle command.
//
// -----------------------------------------------------------------------------

"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui";
import { cn } from "@/foundation";

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
   * The currently resolved vehicle Asset.
   *
   * This is already a presentation-safe Asset reference supplied by the
   * owning workflow. The editor does not resolve or construct its URL.
   */
  readonly selectedAsset?: JourneyVehicleAssetOption | null;

  /**
   * Presentation-only submission boundary.
   */
  readonly onSubmit: (
    values: JourneyVehicleFieldValues,
  ) => void;

  /**
   * Requests the owning workflow to open the Asset upload/replacement flow.
   */
  readonly onChangeAsset?: () => void;

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
// Component
// =============================================================================

export function JourneyVehicleEditor({
  initialValue,
  selectedAsset = null,
  onSubmit,
  onChangeAsset,
  onCancel,
  submitting = false,
  submitLabel = "Save vehicle",
  className,
}: JourneyVehicleEditorProps) {
  const [values, setValues] =
    useState<JourneyVehicleFieldValues>(() => ({
      make: initialValue?.make ?? EMPTY_VALUES.make,
      model: initialValue?.model ?? EMPTY_VALUES.model,
      year: initialValue?.year ?? EMPTY_VALUES.year,
      color: initialValue?.color ?? EMPTY_VALUES.color,
      registration:
        initialValue?.registration ?? EMPTY_VALUES.registration,
      assetPublicId:
        initialValue?.assetPublicId ?? EMPTY_VALUES.assetPublicId,
    }));

  // ===========================================================================
  // Presentation State
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
        selectedAsset={selectedAsset}
        onChangeAsset={onChangeAsset}
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
  );
}