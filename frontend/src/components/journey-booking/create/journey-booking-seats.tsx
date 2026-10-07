// src/features/journey-booking/components/create/journey-booking-seats.tsx

// -----------------------------------------------------------------------------
// sisiMove — Journey Booking Seats
// -----------------------------------------------------------------------------
//
// Presentation-only Step 1 of the Journey Booking workflow.
//
// Responsibilities:
//
// - Display Journey seat availability.
// - Allow the passenger to choose the number of seats.
// - Display the selected seat count.
// - Display the estimated total.
// - Report the selected seat count to JourneyBookingForm.
//
// Non-responsibilities:
//
// - Creating the Journey Booking.
// - Calling APIs.
// - Calculating Journey capacity.
// - Reserving seats.
// - Performing authentication or authorization.
// - Confirming the booking.
//
// JourneyBookingForm remains the single source of truth for workflow state.
// -----------------------------------------------------------------------------

"use client";

import { cn } from "@/foundation/utils/cn";

// =============================================================================
// Props
// =============================================================================

export interface JourneyBookingSeatsProps {
  /**
   * Currently selected number of seats.
   */
  readonly seats: number;

  /**
   * Number of seats currently available on the selected Journey.
   */
  readonly availableSeats: number;

  /**
   * Price charged per seat.
   *
   * Used only for display.
   */
  readonly pricePerSeat: number;

  /**
   * Journey currency.
   */
  readonly currency: string;

  /**
   * Whether the Journey currently has seats available.
   */
  readonly isAvailable: boolean;

  /**
   * Prevents interaction while the parent workflow is submitting.
   */
  readonly disabled?: boolean;

  /**
   * Optional validation or workflow error.
   */
  readonly error?: Error | null;

  /**
   * Reports the requested seat count to the parent form.
   */
  readonly onSeatsChange: (
    seats: number,
  ) => void;

  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyBookingSeats({
  seats,
  availableSeats,
  pricePerSeat,
  currency,
  isAvailable,
  disabled = false,
  error = null,
  onSeatsChange,
  className,
}: JourneyBookingSeatsProps) {
  // ---------------------------------------------------------------------------
  // Derived display state
  // ---------------------------------------------------------------------------

  const estimatedTotal =
    pricePerSeat * seats;

  const canDecrease =
    seats > 1 && !disabled;

  const canIncrease =
    seats < availableSeats &&
    !disabled;

  const formattedPrice =
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(pricePerSeat);

  const formattedTotal =
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(estimatedTotal);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  function decreaseSeats(): void {
    if (!canDecrease) {
      return;
    }

    onSeatsChange(seats - 1);
  }

  function increaseSeats(): void {
    if (!canIncrease) {
      return;
    }

    onSeatsChange(seats + 1);
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <section
      aria-labelledby="journey-booking-seats-title"
      className={cn(
        "space-y-6",
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div className="space-y-1">
        <h2
          id="journey-booking-seats-title"
          className="text-lg font-semibold text-[var(--foreground)]"
        >
          How many seats do you need?
        </h2>

        <p className="text-sm text-[var(--foreground-secondary)]">
          Choose the number of seats you want to book
          on this journey.
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Availability                                                        */}
      {/* ------------------------------------------------------------------- */}

      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--background-subtle)] p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[var(--foreground)]">
              Seats available
            </p>

            <p className="mt-1 text-xs text-[var(--foreground-secondary)]">
              {isAvailable
                ? `${availableSeats} seat${
                    availableSeats === 1
                      ? ""
                      : "s"
                  } currently available`
                : "This journey is currently full"}
            </p>
          </div>

          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-full",
              isAvailable
                ? "bg-[var(--success-soft)] text-[var(--success)]"
                : "bg-[var(--danger-soft)] text-[var(--danger)]",
            )}
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              className="size-5"
            >
              <path
                d="M6 8.5a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM14 8.5a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM2.75 16c.35-2.3 1.55-3.5 3.25-3.5h0c1.7 0 2.9 1.2 3.25 3.5M10.75 16c.35-2.3 1.55-3.5 3.25-3.5h0c1.7 0 2.9 1.2 3.25 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Seat selector                                                       */}
      {/* ------------------------------------------------------------------- */}

      <div className="flex flex-col items-center rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <p className="text-sm font-medium text-[var(--foreground-secondary)]">
          Seats
        </p>

        <div className="mt-5 flex items-center gap-6">
          <button
            type="button"
            aria-label="Decrease number of seats"
            onClick={decreaseSeats}
            disabled={!canDecrease}
            className="flex size-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] transition-colors hover:bg-[var(--background-muted)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              className="size-5"
              aria-hidden="true"
            >
              <path
                d="M5 10h10"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div
            aria-live="polite"
            aria-label={`${seats} seat${
              seats === 1 ? "" : "s"
            } selected`}
            className="flex min-w-20 flex-col items-center"
          >
            <span className="text-4xl font-bold tracking-tight text-[var(--foreground)]">
              {seats}
            </span>

            <span className="mt-1 text-xs text-[var(--foreground-muted)]">
              {seats === 1
                ? "seat"
                : "seats"}
            </span>
          </div>

          <button
            type="button"
            aria-label="Increase number of seats"
            onClick={increaseSeats}
            disabled={!canIncrease}
            className="flex size-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] transition-colors hover:bg-[var(--background-muted)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              className="size-5"
              aria-hidden="true"
            >
              <path
                d="M10 5v10M5 10h10"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Pricing preview                                                   */}
        {/* ----------------------------------------------------------------- */}

        <div className="mt-7 w-full max-w-sm border-t border-[var(--border-subtle)] pt-5">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-[var(--foreground-secondary)]">
              Price per seat
            </span>

            <span className="font-medium text-[var(--foreground)]">
              {formattedPrice}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-[var(--foreground)]">
              Estimated total
            </span>

            <span className="text-lg font-bold text-[var(--foreground)]">
              {formattedTotal}
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Error                                                              */}
      {/* ------------------------------------------------------------------- */}

      {error !== null && (
        <div
          role="alert"
          className="rounded-[var(--radius-md)] border border-[var(--danger)] bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]"
        >
          {error.message}
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Availability note                                                   */}
      {/* ------------------------------------------------------------------- */}

      {isAvailable && (
        <p className="text-center text-xs text-[var(--foreground-muted)]">
          You can select up to {availableSeats}{" "}
          {availableSeats === 1
            ? "seat"
            : "seats"}{" "}
          for this journey.
        </p>
      )}
    </section>
  );
}

export default JourneyBookingSeats;