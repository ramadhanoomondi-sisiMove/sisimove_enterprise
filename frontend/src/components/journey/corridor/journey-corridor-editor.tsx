// -----------------------------------------------------------------------------
// sisiMove — Journey Corridor Editor
// -----------------------------------------------------------------------------
//
// Presentation-only editor for Journey corridor configuration.
//
// Responsibilities:
// - collect origin/destination names;
// - collect origin/destination coordinates;
// - expose submit/cancel interactions;
// - report primitive values to the owning workflow.
//
// This component does NOT:
// - call the Journey API;
// - create a JourneyCorridor entity;
// - construct domain value objects;
// - validate backend domain invariants;
// - persist anything.
//
// The parent workflow owns mutation orchestration.
//
// -----------------------------------------------------------------------------

"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";

import { Button, Input } from "@/components/ui";
import { cn } from "@/foundation";

// =============================================================================
// Types
// =============================================================================

export interface JourneyCorridorFormValues {
  readonly originName: string;
  readonly originLatitude: string;
  readonly originLongitude: string;
  readonly destinationName: string;
  readonly destinationLatitude: string;
  readonly destinationLongitude: string;
}

export interface JourneyCorridorEditorProps {
  readonly initialValue?: Partial<JourneyCorridorFormValues>;

  readonly onSubmit: (values: JourneyCorridorFormValues) => void;

  readonly onCancel?: () => void;

  readonly submitting?: boolean;

  readonly submitLabel?: string;

  readonly className?: string;
}

// =============================================================================
// Defaults
// =============================================================================

const EMPTY_VALUES: JourneyCorridorFormValues = {
  originName: "",
  originLatitude: "",
  originLongitude: "",
  destinationName: "",
  destinationLatitude: "",
  destinationLongitude: "",
};

// =============================================================================
// Component
// =============================================================================

export function JourneyCorridorEditor({
  initialValue,
  onSubmit,
  onCancel,
  submitting = false,
  submitLabel = "Save corridor",
  className,
}: JourneyCorridorEditorProps) {
  const [values, setValues] = useState<JourneyCorridorFormValues>(() => ({
    originName:
      initialValue?.originName !== undefined
        ? initialValue.originName
        : EMPTY_VALUES.originName,

    originLatitude:
      initialValue?.originLatitude !== undefined
        ? initialValue.originLatitude
        : EMPTY_VALUES.originLatitude,

    originLongitude:
      initialValue?.originLongitude !== undefined
        ? initialValue.originLongitude
        : EMPTY_VALUES.originLongitude,

    destinationName:
      initialValue?.destinationName !== undefined
        ? initialValue.destinationName
        : EMPTY_VALUES.destinationName,

    destinationLatitude:
      initialValue?.destinationLatitude !== undefined
        ? initialValue.destinationLatitude
        : EMPTY_VALUES.destinationLatitude,

    destinationLongitude:
      initialValue?.destinationLongitude !== undefined
        ? initialValue.destinationLongitude
        : EMPTY_VALUES.destinationLongitude,
  }));

  function updateField(
    field: keyof JourneyCorridorFormValues,
    value: string,
  ): void {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    onSubmit({
      originName: values.originName,
      originLatitude: values.originLatitude,
      originLongitude: values.originLongitude,
      destinationName: values.destinationName,
      destinationLatitude: values.destinationLatitude,
      destinationLongitude: values.destinationLongitude,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "w-full",
        "space-y-5",
        className,
      )}
    >
      {/* --------------------------------------------------------------------- */}
      {/* Origin                                                                */}
      {/* --------------------------------------------------------------------- */}

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-[var(--foreground)]">
          Starting point
        </legend>

        <Input
          label="Origin"
          value={values.originName}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateField("originName", event.target.value);
          }}
          placeholder="e.g. Nairobi"
          autoComplete="address-level2"
          fullWidth
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            label="Latitude"
            type="text"
            inputMode="decimal"
            value={values.originLatitude}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              updateField("originLatitude", event.target.value);
            }}
            placeholder="e.g. -1.286389"
            fullWidth
          />

          <Input
            label="Longitude"
            type="text"
            inputMode="decimal"
            value={values.originLongitude}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              updateField("originLongitude", event.target.value);
            }}
            placeholder="e.g. 36.817223"
            fullWidth
          />
        </div>
      </fieldset>

      {/* --------------------------------------------------------------------- */}
      {/* Destination                                                           */}
      {/* --------------------------------------------------------------------- */}

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-[var(--foreground)]">
          Destination
        </legend>

        <Input
          label="Destination"
          value={values.destinationName}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateField("destinationName", event.target.value);
          }}
          placeholder="e.g. Mombasa"
          autoComplete="address-level2"
          fullWidth
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            label="Latitude"
            type="text"
            inputMode="decimal"
            value={values.destinationLatitude}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              updateField(
                "destinationLatitude",
                event.target.value,
              );
            }}
            placeholder="e.g. -4.043477"
            fullWidth
          />

          <Input
            label="Longitude"
            type="text"
            inputMode="decimal"
            value={values.destinationLongitude}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              updateField(
                "destinationLongitude",
                event.target.value,
              );
            }}
            placeholder="e.g. 39.668206"
            fullWidth
          />
        </div>
      </fieldset>

      {/* --------------------------------------------------------------------- */}
      {/* Actions                                                               */}
      {/* --------------------------------------------------------------------- */}

      <div
        className={cn(
          "flex",
          "flex-col-reverse",
          "gap-3",
          "sm:flex-row",
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