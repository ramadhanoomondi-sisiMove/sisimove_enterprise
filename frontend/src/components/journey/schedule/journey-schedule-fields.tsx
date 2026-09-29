// -----------------------------------------------------------------------------
// sisiMove — Journey Schedule Fields
// -----------------------------------------------------------------------------
//
// Presentation-only schedule fields.
//
// This component owns no form state and performs no API mutation.
// The parent editor/workflow owns the values.
//
// Datetime values intentionally remain strings. The owning workflow is
// responsible for validation and conversion before calling the backend.
//
// -----------------------------------------------------------------------------

"use client";

import { Input } from "@/components/ui";
import { cn } from "@/foundation";

// =============================================================================
// Types
// =============================================================================

export interface JourneyScheduleFieldValues {
  readonly departureAt: string;
  readonly arrivalAt: string;
  readonly timezone: string;
}

export interface JourneyScheduleFieldsProps {
  readonly values: JourneyScheduleFieldValues;
  readonly onChange: (
    field: keyof JourneyScheduleFieldValues,
    value: string,
  ) => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyScheduleFields({
  values,
  onChange,
  disabled = false,
  className,
}: JourneyScheduleFieldsProps) {
  return (
    <div
      className={cn(
        "space-y-5",
        className,
      )}
    >
      <Input
        label="Departure"
        type="datetime-local"
        value={values.departureAt}
        onChange={(event) => {
          onChange("departureAt", event.target.value);
        }}
        disabled={disabled}
        fullWidth
      />

      <Input
        label="Arrival"
        type="datetime-local"
        value={values.arrivalAt}
        onChange={(event) => {
          onChange("arrivalAt", event.target.value);
        }}
        disabled={disabled}
        helperText="Optional. Leave empty if no arrival time is specified."
        fullWidth
      />

      <Input
        label="Timezone"
        value={values.timezone}
        onChange={(event) => {
          onChange("timezone", event.target.value);
        }}
        disabled={disabled}
        placeholder="e.g. Africa/Nairobi"
        fullWidth
      />
    </div>
  );
}