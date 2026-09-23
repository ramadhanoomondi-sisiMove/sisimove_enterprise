// -----------------------------------------------------------------------------
// sisiMove — Journey Capacity Form
// -----------------------------------------------------------------------------
//
// Passenger-seat capacity form for Journey creation.
//
// Architectural rule:
// - The provider declares how many passenger seats they are offering.
// - There is no capacity catalogue.
// - The provider does not select an existing capacity definition.
// - `totalSeats` is provider-supplied Journey data.
// - `bookedSeats` is server-owned Booking/Journey lifecycle state.
// - Backend remains authoritative and must validate the submitted capacity.
//
// Responsibilities:
// - Capture the number of passenger seats being offered.
// - Display the resulting passenger-capacity summary.
// - Delegate submission to the parent.
//
// Non-responsibilities:
// - No API calls.
// - No catalogue fetching.
// - No router usage.
// - No persistence.
// - No capacity mutation.
// - No booking calculations.
// - No backend business-rule enforcement.
//
// Backend write operation:
// - POST /journeys/:journeyPublicId/capacity
//     { totalSeats }
//
// -----------------------------------------------------------------------------

'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

export interface JourneyCapacityFormValue {
  /**
   * Number of passenger seats the provider is offering on this journey.
   *
   * This is provider-supplied creation data.
   */
  totalSeats: number;
}

export interface JourneyCapacityFormProps {
  /**
   * Existing seat capacity, useful when editing or resuming a Journey draft.
   *
   * `bookedSeats` is intentionally not part of this form value because it is
   * server-owned lifecycle state.
   */
  defaultValue?: JourneyCapacityFormValue;

  /**
   * Called after the provider submits a valid seat count.
   */
  onSubmit: (
    value: JourneyCapacityFormValue,
  ) => void | Promise<void>;

  /**
   * Indicates that the parent is persisting the capacity.
   */
  isLoading?: boolean;

  /**
   * Optional error supplied by the parent/application layer.
   */
  error?: string | null;
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export function JourneyCapacityForm({
  defaultValue,
  onSubmit,
  isLoading = false,
  error = null,
}: JourneyCapacityFormProps) {
  // ---------------------------------------------------------------------------
  // Local seat-count state
  // ---------------------------------------------------------------------------
  //
  // The form keeps the input as a string so an empty field can be represented
  // naturally while the provider is editing the value.
  //
  // The value is converted to a number only when submitted.
  //
  const [totalSeats, setTotalSeats] = useState(
    defaultValue?.totalSeats?.toString() ?? '',
  );

  // ---------------------------------------------------------------------------
  // Derived state
  // ---------------------------------------------------------------------------

  const parsedTotalSeats = Number(totalSeats);

  const hasValidSeatCount =
    totalSeats.trim() !== '' &&
    Number.isInteger(parsedTotalSeats) &&
    parsedTotalSeats > 0;

  const canSubmit =
    hasValidSeatCount &&
    !isLoading;

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    await onSubmit({
      totalSeats: parsedTotalSeats,
    });
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Seat count                                                           */}
      {/* ------------------------------------------------------------------ */}

      <div className="space-y-2">
        <div>
          <label
            htmlFor="journey-total-seats"
            className="text-sm font-semibold text-[var(--foreground)]"
          >
            Passenger seats
          </label>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            How many passenger seats are you offering on this journey?
          </p>
        </div>

        <input
          id="journey-total-seats"
          name="totalSeats"
          type="number"
          min={1}
          step={1}
          inputMode="numeric"
          value={totalSeats}
          onChange={(event) => {
            setTotalSeats(event.target.value);
          }}
          disabled={isLoading}
          placeholder="e.g. 3"
          aria-describedby="journey-total-seats-help"
          className="block w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--foreground-muted)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/10 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <p
          id="journey-total-seats-help"
          className="text-xs text-[var(--foreground-muted)]"
        >
          Enter the number of seats passengers can book.
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Capacity summary                                                     */}
      {/* ------------------------------------------------------------------ */}

      {hasValidSeatCount ? (
        <Card className="p-4 sm:p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Passenger capacity
          </p>

          <p className="mt-1 text-base font-semibold text-[var(--foreground)]">
            {parsedTotalSeats}{' '}
            {parsedTotalSeats === 1
              ? 'passenger seat'
              : 'passenger seats'}
          </p>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Passengers can book from the seats you make available.
          </p>
        </Card>
      ) : null}

      {/* ------------------------------------------------------------------ */}
      {/* Parent/application error                                             */}
      {/* ------------------------------------------------------------------ */}

      {error ? (
        <p
          role="alert"
          className="rounded-lg bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]"
        >
          {error}
        </p>
      ) : null}

      {/* ------------------------------------------------------------------ */}
      {/* Form action                                                          */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex justify-end border-t border-[var(--border-subtle)] pt-4">
        <Button
          type="submit"
          disabled={!canSubmit}
        >
          {isLoading ? 'Saving…' : 'Continue'}
        </Button>
      </div>
    </form>
  );
}

