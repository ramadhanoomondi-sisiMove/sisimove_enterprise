// -----------------------------------------------------------------------------
// sisiMove — Journey Vehicle Editor
// -----------------------------------------------------------------------------
//
// Presentation-only editor for a Journey vehicle.
//
// Responsibilities:
// - maintain local presentation state;
// - collect primitive vehicle values;
// - emit those values through onSubmit.
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
// Those responsibilities belong to the owning application workflow/backend.
//
// -----------------------------------------------------------------------------

"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui";
import { cn } from "@/foundation";

import {
  JourneyVehicleFields,
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
   * Presentation-only submission boundary.
   */
  readonly onSubmit: (values: JourneyVehicleFieldValues) => void;

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
  onSubmit,
  onCancel,
  submitting = false,
  submitLabel = "Save vehicle",
  className,
}: JourneyVehicleEditorProps) {
  const [values, setValues] = useState<JourneyVehicleFieldValues>(() => ({
    ...EMPTY_VALUES,
    ...initialValue,
  }));

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

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    onSubmit(values);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "w-full",
        "space-y-6",
        className,
      )}
    >
      <JourneyVehicleFields
        values={values}
        onChange={updateField}
        disabled={submitting}
      />

      <div className="flex flex-wrap items-center justify-end gap-3">
        {onCancel ? (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
        ) : null}

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