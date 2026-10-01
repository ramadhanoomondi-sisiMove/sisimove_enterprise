// -----------------------------------------------------------------------------
// sisiMove — Journey Preferences Editor
// -----------------------------------------------------------------------------
//
// Presentation-only Journey preferences editor.
//
// The parent workflow owns:
// - API calls;
// - persistence;
// - domain validation;
// - lifecycle decisions.
//
// This component owns only local form state.
// -----------------------------------------------------------------------------

"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui";
import { cn } from "@/foundation/utils/cn";

import {
  JourneyPreferencesFields,
  type JourneyPreferencesFieldValues,
} from "./journey-preferences-fields";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyPreferencesEditorProps {
  readonly initialValue?: Partial<JourneyPreferencesFieldValues>;

  readonly onSubmit: (values: JourneyPreferencesFieldValues) => void;

  readonly onCancel?: () => void;

  readonly submitting?: boolean;

  readonly submitLabel?: string;

  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Defaults
// -----------------------------------------------------------------------------
//
// Canonical Journey preference defaults:
//
//   smoking      -> NOT_ALLOWED
//   pets         -> NOT_ALLOWED
//   luggage      -> STANDARD
//   conversation -> MODERATE
//   music        -> LOW
//
// These match the Journey aggregate / Prisma defaults.
// -----------------------------------------------------------------------------

const EMPTY_VALUES = {
  smoking: "NOT_ALLOWED",
  pets: "NOT_ALLOWED",
  luggage: "STANDARD",
  conversation: "MODERATE",
  music: "LOW",
} satisfies JourneyPreferencesFieldValues;

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyPreferencesEditor({
  initialValue,
  onSubmit,
  onCancel,
  submitting = false,
  submitLabel = "Save preferences",
  className,
}: JourneyPreferencesEditorProps) {
  const [values, setValues] =
    useState<JourneyPreferencesFieldValues>(() => ({
      smoking:
        initialValue?.smoking !== undefined
          ? initialValue.smoking
          : EMPTY_VALUES.smoking,

      pets:
        initialValue?.pets !== undefined
          ? initialValue.pets
          : EMPTY_VALUES.pets,

      luggage:
        initialValue?.luggage !== undefined
          ? initialValue.luggage
          : EMPTY_VALUES.luggage,

      conversation:
        initialValue?.conversation !== undefined
          ? initialValue.conversation
          : EMPTY_VALUES.conversation,

      music:
        initialValue?.music !== undefined
          ? initialValue.music
          : EMPTY_VALUES.music,
    }));

  function updateField<
    TField extends keyof JourneyPreferencesFieldValues,
  >(
    field: TField,
    value: JourneyPreferencesFieldValues[TField],
  ): void {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    onSubmit({
      smoking: values.smoking,
      pets: values.pets,
      luggage: values.luggage,
      conversation: values.conversation,
      music: values.music,
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
      <JourneyPreferencesFields
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