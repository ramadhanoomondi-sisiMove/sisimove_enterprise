// -----------------------------------------------------------------------------
// sisiMove — Journey Pricing Editor
// -----------------------------------------------------------------------------
//
// Presentation-only Journey pricing editor.
//
// Amount remains a string until the owning workflow converts it for the
// backend command. This avoids embedding numeric parsing or domain validation
// inside the reusable form component.
// -----------------------------------------------------------------------------

"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui";
import { cn } from "@/foundation/utils/cn";

import {
  JourneyPriceFields,
  type JourneyPriceFieldValues,
} from "./journey-price-fields";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyPricingEditorProps {
  readonly initialValue?: Partial<JourneyPriceFieldValues>;

  readonly onSubmit: (values: JourneyPriceFieldValues) => void;

  readonly onCancel?: () => void;

  readonly submitting?: boolean;

  readonly submitLabel?: string;

  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Defaults
// -----------------------------------------------------------------------------

const EMPTY_VALUES = {
  amount: "",
  currency: "KES",
} satisfies JourneyPriceFieldValues;

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyPricingEditor({
  initialValue,
  onSubmit,
  onCancel,
  submitting = false,
  submitLabel = "Save price",
  className,
}: JourneyPricingEditorProps) {
  const [values, setValues] = useState<JourneyPriceFieldValues>(() => ({
    ...EMPTY_VALUES,
    ...initialValue,
  }));

  function updateField(
    field: keyof JourneyPriceFieldValues,
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
      className={cn("space-y-6", className)}
      onSubmit={handleSubmit}
    >
      <JourneyPriceFields
        values={values}
        onChange={updateField}
        disabled={submitting}
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