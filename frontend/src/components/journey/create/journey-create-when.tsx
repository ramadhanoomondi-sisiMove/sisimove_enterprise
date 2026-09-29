// -----------------------------------------------------------------------------
// sisiMove — Journey Create When
// -----------------------------------------------------------------------------
//
// Presentation-only creation step for collecting Journey schedule information.
//
// Responsibilities:
// - collect departure date/time;
// - collect optional arrival date/time;
// - collect the schedule timezone;
// - emit primitive string values through onChange;
// - render the existing UI primitives.
//
// The parent JourneyCreateForm owns:
// - date/time validation;
// - conversion/normalization to the backend command format;
// - attachJourneySchedule();
// - persistence errors;
// - navigation to the next creation step.
//
// Date/time values intentionally remain strings in this component.
// No Date objects are constructed here and no timezone conversion is
// performed here.
//
// The backend schedule contract is:
// - departureAt: required;
// - arrivalAt: optional;
// - timezone: required.
//
// Default timezone is presented as Africa/Nairobi, but the parent may provide
// another initial value when editing/re-entering the step.
// -----------------------------------------------------------------------------

import { Input } from "@/components/ui/input";
import { cn } from "@/foundation/utils/cn";

export interface JourneyCreateWhenValues {
  readonly departureAt: string;
  readonly arrivalAt: string;
  readonly timezone: string;
}

export interface JourneyCreateWhenProps {
  readonly values: JourneyCreateWhenValues;
  readonly onChange: (
    field: keyof JourneyCreateWhenValues,
    value: string,
  ) => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function JourneyCreateWhen({
  values,
  onChange,
  disabled = false,
  className,
}: JourneyCreateWhenProps) {
  return (
    <section
      aria-labelledby="journey-create-when-title"
      className={cn("space-y-6", className)}
    >
      <div className="space-y-1">
        <h2
          id="journey-create-when-title"
          className="text-lg font-semibold text-[var(--foreground)]"
        >
          When are you travelling?
        </h2>

        <p className="text-sm text-[var(--foreground-secondary)]">
          Set the departure time and, if known, the expected arrival time.
        </p>
      </div>

      <div className="space-y-5">
        <Input
          label="Departure"
          type="datetime-local"
          value={values.departureAt}
          onChange={(event) =>
            onChange("departureAt", event.target.value)
          }
          disabled={disabled}
          fullWidth
        />

        <Input
          label="Expected arrival"
          type="datetime-local"
          value={values.arrivalAt}
          onChange={(event) =>
            onChange("arrivalAt", event.target.value)
          }
          helperText="Optional"
          disabled={disabled}
          fullWidth
        />

        <Input
          label="Timezone"
          value={values.timezone}
          onChange={(event) =>
            onChange("timezone", event.target.value)
          }
          placeholder="Africa/Nairobi"
          helperText="Use the IANA timezone for the journey schedule."
          disabled={disabled}
          autoComplete="off"
          fullWidth
        />
      </div>
    </section>
  );
}