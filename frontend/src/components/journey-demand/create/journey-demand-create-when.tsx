// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Create When
// -----------------------------------------------------------------------------
//
// Controlled "When" step for the Journey Demand creation flow.
//
// Architecture:
// - Owns no server state.
// - Performs no API requests.
// - Performs no authorization checks.
// - Performs no persistence.
// - Does not construct JourneyDemandSchedule.
// - Does not derive backend schedule convenience flags.
// - Parent create form owns workflow state and submission.
//
// Validation:
// - Earliest departure is required.
// - Latest departure is required.
// - Latest departure must not be earlier than earliest departure.
// - Arrival preferences remain optional.
// - Validation errors are displayed by this step.
// - Parent create form remains responsible for blocking workflow navigation.
//
// Native datetime-local controls intentionally represent local date/time input.
// The parent/application layer is responsible for converting these values to
// the backend's authoritative ISO-8601 schedule representation and timezone.
// -----------------------------------------------------------------------------

'use client';

import type { ChangeEvent } from 'react';

import { Input } from '@/components/ui';
import { cn } from '@/foundation';

// -----------------------------------------------------------------------------
// Value
// -----------------------------------------------------------------------------

export interface JourneyDemandCreateWhenValue {
  /**
   * Local datetime value used by the browser form control.
   *
   * Example:
   * "2026-10-15T06:00"
   */
  readonly earliestDeparture: string;

  /**
   * Local datetime value used by the browser form control.
   *
   * Example:
   * "2026-10-15T09:00"
   */
  readonly latestDeparture: string;

  /**
   * Optional preferred arrival datetime.
   */
  readonly targetArrival: string;

  /**
   * Optional latest acceptable arrival datetime.
   */
  readonly maximumArrival: string;
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandCreateWhenProps {
  readonly value: JourneyDemandCreateWhenValue;
  readonly onChange: (value: JourneyDemandCreateWhenValue) => void;

  /**
   * Validation errors supplied by the parent form.
   *
   * Input.error expects string | undefined, so these intentionally use
   * undefined rather than null.
   */
  readonly earliestDepartureError?: string;
  readonly latestDepartureError?: string;

  readonly disabled?: boolean;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandCreateWhen({
  value,
  onChange,
  earliestDepartureError,
  latestDepartureError,
  disabled = false,
  className,
}: JourneyDemandCreateWhenProps) {
  const hasEarliestDeparture =
    value.earliestDeparture.trim().length > 0;

  const hasLatestDeparture =
    value.latestDeparture.trim().length > 0;

  const departureOrderError: string | undefined =
    hasEarliestDeparture &&
    hasLatestDeparture &&
    value.latestDeparture < value.earliestDeparture
      ? 'Latest departure cannot be earlier than earliest departure.'
      : undefined;

  const handleChange =
    (field: keyof JourneyDemandCreateWhenValue) =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      onChange({
        ...value,
        [field]: event.target.value,
      });
    };

  const earliestDepartureValidationError:
    | string
    | undefined =
    earliestDepartureError ??
    (!hasEarliestDeparture
      ? 'Please select your earliest departure time.'
      : undefined);

  const latestDepartureValidationError:
    | string
    | undefined =
    latestDepartureError ??
    departureOrderError ??
    (!hasLatestDeparture
      ? 'Please select your latest departure time.'
      : undefined);

  return (
    <section
      className={cn(
        'min-w-0',
        className,
      )}
      aria-labelledby="journey-demand-create-when-heading"
    >
      {/* --------------------------------------------------------------------- */}
      {/* Header */}
      {/* --------------------------------------------------------------------- */}

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'inline-flex h-6 min-w-6 items-center justify-center',
              'rounded-full',
              'bg-[var(--brand-soft)]',
              'px-2',
              'text-xs font-semibold',
              'text-[var(--brand)]',
            )}
            aria-hidden="true"
          >
            2
          </span>

          <span className="text-sm font-medium text-[var(--foreground-muted)]">
            When
          </span>
        </div>

        <h2
          id="journey-demand-create-when-heading"
          className="mt-3 text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl"
        >
          When do you want to travel?
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--foreground-secondary)]">
          Give us a departure window so travellers can find a journey that
          works for you.
        </p>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* Departure Window */}
      {/* --------------------------------------------------------------------- */}

      <div className="mt-7 min-w-0">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Departure window
            </h3>

            <span
              className={cn(
                'inline-flex items-center rounded-full',
                'bg-[var(--brand-soft)]',
                'px-2.5 py-1',
                'text-xs font-medium',
                'text-[var(--brand)]',
              )}
            >
              Required
            </span>
          </div>

          <p className="mt-1 text-sm leading-5 text-[var(--foreground-muted)]">
            Choose the earliest and latest times you can leave.
          </p>
        </div>

        <div className="grid min-w-0 gap-5 sm:grid-cols-2">
          <Input
            id="journey-demand-create-earliest-departure"
            name="earliestDeparture"
            type="datetime-local"
            label="Earliest departure"
            value={value.earliestDeparture}
            onChange={handleChange('earliestDeparture')}
            disabled={disabled}
            error={earliestDepartureValidationError}
            fullWidth
          />

          <Input
            id="journey-demand-create-latest-departure"
            name="latestDeparture"
            type="datetime-local"
            label="Latest departure"
            value={value.latestDeparture}
            onChange={handleChange('latestDeparture')}
            disabled={disabled}
            error={latestDepartureValidationError}
            fullWidth
          />
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* Arrival Preference */}
      {/* --------------------------------------------------------------------- */}

      <div className="mt-8 border-t border-[var(--border-subtle)] pt-7">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Arrival preference
            </h3>

            <span
              className={cn(
                'inline-flex items-center rounded-full',
                'bg-[var(--background-muted)]',
                'px-2.5 py-1',
                'text-xs font-medium',
                'text-[var(--foreground-muted)]',
              )}
            >
              Optional
            </span>
          </div>

          <p className="mt-1 max-w-xl text-sm leading-5 text-[var(--foreground-muted)]">
            Let us know when you would ideally arrive or the latest time you
            can arrive.
          </p>
        </div>

        <div className="mt-5 grid min-w-0 gap-5 sm:grid-cols-2">
          <Input
            id="journey-demand-create-target-arrival"
            name="targetArrival"
            type="datetime-local"
            label="Target arrival"
            value={value.targetArrival}
            onChange={handleChange('targetArrival')}
            disabled={disabled}
            fullWidth
          />

          <Input
            id="journey-demand-create-maximum-arrival"
            name="maximumArrival"
            type="datetime-local"
            label="Latest acceptable arrival"
            value={value.maximumArrival}
            onChange={handleChange('maximumArrival')}
            disabled={disabled}
            fullWidth
          />
        </div>
      </div>
    </section>
  );
}

export default JourneyDemandCreateWhen;