
// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Schedule Fields
// -----------------------------------------------------------------------------
//
// Controlled field editor for an authenticated Journey Demand schedule.
//
// Architecture:
// - Consumes the authenticated JourneyDemandSchedule model.
// - Does not fetch data.
// - Does not persist data.
// - Does not call mutation hooks.
// - Emits a complete updated JourneyDemandSchedule through onChange.
// - Does not reconstruct backend convenience flags.
// - Does not calculate schedule semantics from dates.
//
// The parent schedule editor (104) owns:
// - persistence;
// - mutation orchestration;
// - authorization/capability decisions;
// - loading/error/success state.
//
// This component owns only the editable schedule fields.
//
// IMPORTANT:
// Backend-provided convenience flags such as:
//
//   hasTargetArrival
//   hasMaximumArrival
//   hasArrivalConstraint
//   hasDepartureWindow
//   isExactDepartureTime
//   isExactArrivalTime
//
// are not recalculated here. They are backend-owned facts and should be
// refreshed from the backend response after a successful mutation.
//
// -----------------------------------------------------------------------------

'use client';

import type { ChangeEvent } from 'react';

import type {
  JourneyDemandSchedule,
} from '@/features/journey-demand/models';
import { cn } from '@/foundation';

export interface JourneyDemandScheduleFieldsProps {
  readonly schedule: JourneyDemandSchedule;
  readonly onChange?: (schedule: JourneyDemandSchedule) => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function JourneyDemandScheduleFields({
  schedule,
  onChange,
  disabled = false,
  className,
}: JourneyDemandScheduleFieldsProps) {
  const handleEarliestDepartureChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const earliestDeparture = parseDateTimeLocal(
      event.target.value,
    );

    if (!earliestDeparture) {
      return;
    }

    onChange?.({
      ...schedule,
      scheduleWindow: {
        ...schedule.scheduleWindow,
        earliestDeparture,
      },
    });
  };

  const handleLatestDepartureChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const latestDeparture = parseDateTimeLocal(
      event.target.value,
    );

    if (!latestDeparture) {
      return;
    }

    onChange?.({
      ...schedule,
      scheduleWindow: {
        ...schedule.scheduleWindow,
        latestDeparture,
      },
    });
  };

  const handleTargetArrivalChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const targetArrival = parseOptionalDateTimeLocal(
      event.target.value,
    );

    onChange?.({
      ...schedule,
      arrivalWindow: {
        ...schedule.arrivalWindow,
        targetArrival,
      },
    });
  };

  const handleMaximumArrivalChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const maximumArrival = parseOptionalDateTimeLocal(
      event.target.value,
    );

    onChange?.({
      ...schedule,
      arrivalWindow: {
        ...schedule.arrivalWindow,
        maximumArrival,
      },
    });
  };

  return (
    <fieldset
      disabled={disabled}
      className={cn(
        'grid min-w-0 gap-5',
        className,
      )}
    >
      <legend className="sr-only">
        Journey Demand schedule fields
      </legend>

      {/* ---------------------------------------------------------------------
          Departure window
      --------------------------------------------------------------------- */}
      <section className="grid min-w-0 gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Departure window
          </h3>

          <p className="mt-1 text-xs text-foreground-muted">
            Set the earliest and latest acceptable departure times.
          </p>
        </div>

        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          <DateTimeField
            id="journey-demand-earliest-departure"
            label="Earliest departure"
            value={toDateTimeLocalValue(
              schedule.scheduleWindow.earliestDeparture,
            )}
            onChange={handleEarliestDepartureChange}
          />

          <DateTimeField
            id="journey-demand-latest-departure"
            label="Latest departure"
            value={toDateTimeLocalValue(
              schedule.scheduleWindow.latestDeparture,
            )}
            onChange={handleLatestDepartureChange}
          />
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          Arrival constraints
      --------------------------------------------------------------------- */}
      <section className="grid min-w-0 gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Arrival constraints
          </h3>

          <p className="mt-1 text-xs text-foreground-muted">
            Arrival requirements are optional.
          </p>
        </div>

        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          <DateTimeField
            id="journey-demand-target-arrival"
            label="Target arrival"
            value={toDateTimeLocalValue(
              schedule.arrivalWindow.targetArrival,
            )}
            onChange={handleTargetArrivalChange}
            optional
          />

          <DateTimeField
            id="journey-demand-maximum-arrival"
            label="Latest acceptable arrival"
            value={toDateTimeLocalValue(
              schedule.arrivalWindow.maximumArrival,
            )}
            onChange={handleMaximumArrivalChange}
            optional
          />
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          Timezone
      --------------------------------------------------------------------- */}
      <section className="grid min-w-0 gap-2">
        <div>
          <label
            htmlFor="journey-demand-timezone"
            className="text-sm font-medium text-foreground"
          >
            Timezone
          </label>

          <p className="mt-1 text-xs text-foreground-muted">
            Schedule times are interpreted using this IANA timezone.
          </p>
        </div>

        <input
          id="journey-demand-timezone"
          type="text"
          value={schedule.timezone}
          readOnly
          className={cn(
            'min-h-10 w-full rounded-[var(--radius-md)]',
            'border border-[var(--border)]',
            'bg-[var(--background-muted)]',
            'px-3 text-sm text-foreground',
            'outline-none',
          )}
        />
      </section>
    </fieldset>
  );
}

// -----------------------------------------------------------------------------
// Date/time field
// -----------------------------------------------------------------------------

interface DateTimeFieldProps {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  readonly optional?: boolean;
}

function DateTimeField({
  id,
  label,
  value,
  onChange,
  optional = false,
}: DateTimeFieldProps) {
  return (
    <label
      htmlFor={id}
      className="grid min-w-0 gap-1.5"
    >
      <span className="flex items-center gap-2 text-sm font-medium text-foreground">
        {label}

        {optional ? (
          <span className="text-xs font-normal text-foreground-muted">
            Optional
          </span>
        ) : null}
      </span>

      <input
        id={id}
        type="datetime-local"
        value={value}
        onChange={onChange}
        className={cn(
          'min-h-10 w-full min-w-0 rounded-[var(--radius-md)]',
          'border border-[var(--border)]',
          'bg-[var(--background)]',
          'px-3 text-sm text-foreground',
          'outline-none transition-colors',
          'focus:border-[var(--brand)]',
          'focus:ring-2 focus:ring-[var(--brand-soft)]',
          'disabled:cursor-not-allowed',
          'disabled:bg-[var(--background-muted)]',
        )}
      />
    </label>
  );
}

// -----------------------------------------------------------------------------
// Date conversion
// -----------------------------------------------------------------------------
//
// HTML datetime-local deliberately has no timezone information. The value is
// therefore converted to/from a Date using the browser's local representation.
//
// The schedule's canonical timezone remains owned by the backend model.
//
// This component does not attempt to perform IANA timezone conversion because
// that would require a timezone-aware date library/formatter contract that is
// not established here.
// -----------------------------------------------------------------------------

function toDateTimeLocalValue(
  value: Date | undefined,
): string {
  if (!value) {
    return '';
  }

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  const hours = String(value.getHours()).padStart(2, '0');
  const minutes = String(value.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function parseDateTimeLocal(
  value: string,
): Date | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

function parseOptionalDateTimeLocal(
  value: string,
): Date | undefined {
  if (!value) {
    return undefined;
  }

  return parseDateTimeLocal(value) ?? undefined;
}

