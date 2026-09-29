// -----------------------------------------------------------------------------
// sisiMove — Journey Preferences Editor
// -----------------------------------------------------------------------------
//
// Presentation-only Journey preferences editor.
//
// The parent workflow owns API calls, persistence, domain validation, and
// lifecycle decisions. This component owns only local form state.
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

const EMPTY_VALUES = {
  smoking: false,
  pets: false,
  luggage: true,
  conversation: true,
  music: true,
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
  const [values, setValues] = useState<JourneyPreferencesFieldValues>(() => ({
    ...EMPTY_VALUES,
    ...initialValue,
  }));

  function updateField(
    field: keyof JourneyPreferencesFieldValues,
    value: boolean,
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
      <JourneyPreferencesFields
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