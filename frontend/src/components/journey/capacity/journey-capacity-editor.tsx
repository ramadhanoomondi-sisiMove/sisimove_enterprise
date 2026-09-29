// -----------------------------------------------------------------------------
// sisiMove — Journey Capacity Editor
// -----------------------------------------------------------------------------
//
// Presentation-only Journey capacity editor.
//
// The Journey backend derives bookedSeats and availableSeats.
// Therefore this editor only exposes totalSeats.
//
// The parent workflow owns:
// - API calls;
// - domain validation;
// - persistence;
// - refetch/invalidation;
// - navigation;
// - error handling.
// -----------------------------------------------------------------------------

"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui";
import { cn } from "@/foundation/utils/cn";

import { JourneySeatControl } from "./journey-seat-control";

// -----------------------------------------------------------------------------
// Values
// -----------------------------------------------------------------------------

export interface JourneyCapacityFieldValues {
  readonly totalSeats: number;
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyCapacityEditorProps {
  readonly initialValue?: Partial<JourneyCapacityFieldValues>;

  readonly onSubmit: (values: JourneyCapacityFieldValues) => void;

  readonly onCancel?: () => void;

  readonly submitting?: boolean;

  readonly submitLabel?: string;

  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Defaults
// -----------------------------------------------------------------------------

const EMPTY_VALUES = {
  totalSeats: 0,
} satisfies JourneyCapacityFieldValues;

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyCapacityEditor({
  initialValue,
  onSubmit,
  onCancel,
  submitting = false,
  submitLabel = "Save capacity",
  className,
}: JourneyCapacityEditorProps) {
  const [values, setValues] = useState<JourneyCapacityFieldValues>(() => ({
    ...EMPTY_VALUES,
    ...initialValue,
  }));

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <form
      className={cn("space-y-6", className)}
      onSubmit={handleSubmit}
    >
      <JourneySeatControl
        value={values.totalSeats}
        onChange={(totalSeats) => {
          setValues((current) => ({
            ...current,
            totalSeats,
          }));
        }}
        disabled={submitting}
        helperText="Booked and available seats are managed by the Journey lifecycle."
      />

      <div className={cn("flex", "flex-col-reverse", "gap-3", "sm:flex-row", "sm:justify-end")}>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            disabled={submitting}
            onClick={onCancel}
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