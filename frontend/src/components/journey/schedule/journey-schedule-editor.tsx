// -----------------------------------------------------------------------------
// sisiMove — Journey Schedule Editor
// -----------------------------------------------------------------------------
//
// Presentation-only editor for a Journey schedule.
//
// Responsibilities:
// - maintain local presentation state;
// - collect departure, optional arrival, and timezone values;
// - emit primitive values through onSubmit.
//
// This component does NOT:
// - call the API;
// - construct domain value objects;
// - calculate durations;
// - convert datetime values;
// - validate timezone identifiers;
// - decide whether the Journey may attach/replace a schedule.
//
// Those responsibilities belong to the owning application workflow/backend.
//
// -----------------------------------------------------------------------------

"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui";
import { cn } from "@/foundation";

import {
  JourneyScheduleFields,
  type JourneyScheduleFieldValues,
} from "./journey-schedule-fields";

// =============================================================================
// Types
// =============================================================================

export interface JourneyScheduleEditorProps {
  /**
   * Initial values are read once when the editor mounts.
   *
   * The editor intentionally does not synchronize its local state from
   * subsequent initialValue changes. The owning workflow controls whether
   * the editor is mounted for a different schedule.
   */
  readonly initialValue?: Partial<JourneyScheduleFieldValues>;

  /**
   * Presentation-only submission boundary.
   *
   * Persistence, validation, primitive-to-domain conversion, and API
   * mutation remain responsibilities of the owning workflow.
   */
  readonly onSubmit: (values: JourneyScheduleFieldValues) => void;

  readonly onCancel?: () => void;

  /**
   * Indicates that the owning workflow is currently performing a mutation.
   */
  readonly submitting?: boolean;

  readonly submitLabel?: string;

  readonly className?: string;
}

// =============================================================================
// Defaults
// =============================================================================

const EMPTY_VALUES: JourneyScheduleFieldValues = {
  departureAt: "",
  arrivalAt: "",
  timezone: "Africa/Nairobi",
};

// =============================================================================
// Component
// =============================================================================

export function JourneyScheduleEditor({
  initialValue,
  onSubmit,
  onCancel,
  submitting = false,
  submitLabel = "Save schedule",
  className,
}: JourneyScheduleEditorProps) {
  const [values, setValues] = useState<JourneyScheduleFieldValues>(() => ({
    ...EMPTY_VALUES,
    ...initialValue,
  }));

  /**
   * Update one presentation field.
   *
   * Schedule values remain strings until the owning workflow submits them.
   */
  function updateField(
    field: keyof JourneyScheduleFieldValues,
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
      <JourneyScheduleFields
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