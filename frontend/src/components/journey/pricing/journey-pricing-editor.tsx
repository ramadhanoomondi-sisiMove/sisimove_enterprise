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
  const [values, setValues] =
    useState<JourneyPriceFieldValues>(() => ({
      amount:
        initialValue?.amount !== undefined
          ? initialValue.amount
          : EMPTY_VALUES.amount,

      currency:
        initialValue?.currency !== undefined
          ? initialValue.currency
          : EMPTY_VALUES.currency,
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

    onSubmit({
      amount: values.amount,
      currency: values.currency,
    });
  }

  return (
    <form
      className={cn(
        "w-full",
        "space-y-5",
        className,
      )}
      onSubmit={handleSubmit}
    >
      <JourneyPriceFields
        values={values}
        onChange={updateField}
        disabled={submitting}
      />

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