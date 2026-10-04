// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Create Seats
// -----------------------------------------------------------------------------
//
// Controlled "Seats" step for the Journey Demand creation flow.
//
// Architecture:
// - Owns no server state.
// - Performs no API requests.
// - Performs no authorization checks.
// - Performs no persistence.
// - Does not construct JourneyDemandCapacity.
// - Does not expose or modify matchedSeats.
// - Does not derive capacity state such as remaining/full.
// - Parent create form owns workflow state and submission.
//
// Validation:
// - At least 1 seat is required.
// - Zero seats is invalid.
// - Negative values are invalid.
// - Seat quantity is controlled by JourneyDemandSeatControl.
// - Validation errors may be supplied by the parent.
// - Parent create form remains responsible for blocking workflow navigation.
//
// The traveller specifies how many seats are needed. Matching information is
// backend-owned and therefore does not belong in this creation step.
// -----------------------------------------------------------------------------

'use client';

import { cn } from '@/foundation';

import { JourneyDemandSeatControl } from '@/components/journey-demand/capacity';

// -----------------------------------------------------------------------------
// Value
// -----------------------------------------------------------------------------

export interface JourneyDemandCreateSeatsValue {
  readonly requestedSeats: number;
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandCreateSeatsProps {
  readonly value: JourneyDemandCreateSeatsValue;

  readonly onChange: (
    value: JourneyDemandCreateSeatsValue,
  ) => void;

  /**
   * Validation error supplied by the parent form.
   *
   * The parent owns workflow validation and persistence policy.
   */
  readonly error?: string;

  readonly disabled?: boolean;

  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandCreateSeats({
  value,
  onChange,
  error,
  disabled = false,
  className,
}: JourneyDemandCreateSeatsProps) {
  const hasSeats =
    value.requestedSeats > 0;

  const validationError =
    error ??
    (value.requestedSeats <= 0
      ? 'Please enter at least 1 seat.'
      : undefined);

  const handleSeatsChange = (
    requestedSeats: number,
  ): void => {
    onChange({
      requestedSeats,
    });
  };

  return (
    <section
      className={cn(
        'min-w-0',
        className,
      )}
      aria-labelledby="journey-demand-create-seats-heading"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Header */}
      {/* ------------------------------------------------------------------- */}

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
            3
          </span>

          <span className="text-sm font-medium text-[var(--foreground-muted)]">
            Seats
          </span>
        </div>

        <h2
          id="journey-demand-create-seats-heading"
          className="mt-3 text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl"
        >
          How many seats do you need?
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--foreground-secondary)]">
          Tell us how many people need seats for this travel request.
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Seat Selection */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          'mt-7 min-w-0 max-w-md',
          'rounded-[var(--radius-lg)]',
          'border border-[var(--border)]',
          'bg-[var(--background-subtle)]',
          'p-5 sm:p-6',
        )}
      >
        <JourneyDemandSeatControl
          value={value.requestedSeats}
          onChange={handleSeatsChange}
          min={1}
          disabled={disabled}
          id="journey-demand-create-requested-seats"
          label="Seats needed"
        />

        {/* ----------------------------------------------------------------- */}
        {/* Validation */}
        {/* ----------------------------------------------------------------- */}

        {validationError ? (
          <p
            className="mt-2 text-sm text-[var(--danger)]"
            role="alert"
          >
            {validationError}
          </p>
        ) : null}

        {/* ----------------------------------------------------------------- */}
        {/* Context */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={cn(
            'mt-5 border-t border-[var(--border-subtle)]',
            'pt-4',
          )}
        >
          <p className="text-xs leading-5 text-[var(--foreground-muted)]">
            This is the number of passenger seats you are requesting.
            Journey matching and available capacity are handled by SisiMove.
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Selected State */}
      {/* ------------------------------------------------------------------- */}

      {hasSeats ? (
        <div
          className="mt-5 flex items-center gap-2 text-sm text-[var(--foreground-secondary)]"
          role="status"
          aria-live="polite"
        >
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]"
            aria-hidden="true"
          />

          <span>
            Requesting{' '}
            <span className="font-semibold text-[var(--foreground)]">
              {value.requestedSeats}{' '}
              {value.requestedSeats === 1
                ? 'seat'
                : 'seats'}
            </span>
          </span>
        </div>
      ) : null}
    </section>
  );
}

export default JourneyDemandCreateSeats;

