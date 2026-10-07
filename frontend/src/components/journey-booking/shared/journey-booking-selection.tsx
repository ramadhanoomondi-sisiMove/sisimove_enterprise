// -----------------------------------------------------------------------------
// Path:
// src/components/journey-booking/shared/journey-booking-selection.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Booking Selection
//
// Presentation component for the final Booking selection/review surface.
//
// This component is intentionally small.
//
// It receives the already-resolved values required to present the Booking
// selection:
//
//     seats
//     availableSeats
//     pricePerSeat
//     currency
//     availability
//     submission state
//     mutation error
//
// It does NOT:
//
// - fetch Journey data;
// - fetch Identity data;
// - call the Booking API;
// - create a Booking;
// - calculate Journey capacity;
// - determine Booking lifecycle;
// - perform authorization;
// - perform domain validation;
// - navigate;
// - reconstruct a Booking aggregate.
//
// The parent workflow:
//
//     NewJourneyBookingPage
//
// owns the application workflow and passes the required presentation state
// into this component.
//
// -----------------------------------------------------------------------------
//
// Composition:
//
//     JourneyBookingSelection
//          │
//          ├── seat selection
//          ├── booking amount review
//          └── confirm booking action
//
// -----------------------------------------------------------------------------
//
// Styling:
//
// This component uses only the frozen sisiMove global design tokens.
//
// It must not introduce local colors, local design tokens, or an independent
// visual language. The global stylesheet remains the single source of truth
// for the product's visual system.
//
// -----------------------------------------------------------------------------

"use client";

import { cn } from "@/foundation";

// =============================================================================
// Props
// =============================================================================

export interface JourneyBookingSelectionProps {
  /**
   * Number of seats currently selected by the traveller.
   *
   * This is local workflow state owned by the parent booking workflow.
   */
  readonly seats: number;

  /**
   * Current number of seats available on the Journey.
   *
   * This value comes directly from the Journey projection.
   *
   * It must not be calculated by this component.
   */
  readonly availableSeats: number;

  /**
   * Published Journey price per seat.
   *
   * This is used only for the review display.
   *
   * The Booking bounded context remains authoritative for persisted pricing.
   */
  readonly pricePerSeat: number;

  /**
   * Currency supplied by the Journey pricing projection.
   */
  readonly currency: string;

  /**
   * Whether the Journey currently has seats available.
   */
  readonly isAvailable: boolean;

  /**
   * Indicates that Booking creation is currently being submitted.
   */
  readonly isSubmitting?: boolean;

  /**
   * Booking mutation error supplied by the parent workflow.
   */
  readonly error?: Error | null;

  /**
   * Called when the traveller changes the requested number of seats.
   *
   * The parent workflow remains responsible for state management.
   */
  readonly onSeatsChange: (seats: number) => void;

  /**
   * Called when the traveller confirms the Booking.
   *
   * The parent workflow owns the actual mutation.
   */
  readonly onSubmit: () => void;

  /**
   * Optional additional classes.
   */
  readonly className?: string;
}

// =============================================================================
// Formatting
// =============================================================================

function formatAmount(
  amount: number,
  currency: string,
): string {
  try {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

// =============================================================================
// Component
// =============================================================================

export function JourneyBookingSelection({
  seats,
  availableSeats,
  pricePerSeat,
  currency,
  isAvailable,
  isSubmitting = false,
  error = null,
  onSeatsChange,
  onSubmit,
  className,
}: JourneyBookingSelectionProps) {
  // ---------------------------------------------------------------------------
  // Presentation guards
  // ---------------------------------------------------------------------------
  //
  // These are UI guards only.
  //
  // The backend remains authoritative when the Booking is created.
  // ---------------------------------------------------------------------------

  const canDecrease =
    seats > 1 && !isSubmitting;

  const canIncrease =
    seats < availableSeats &&
    !isSubmitting;

  const isValidSelection =
    Number.isInteger(seats) &&
    seats >= 1 &&
    seats <= availableSeats;

  const isSubmitDisabled =
    !isAvailable ||
    !isValidSelection ||
    isSubmitting;

  // ---------------------------------------------------------------------------
  // Display amount
  // ---------------------------------------------------------------------------
  //
  // This is a review value only.
  //
  // We intentionally do not submit this amount to the backend.
  //
  // The Booking bounded context creates its authoritative pricing entity when
  // the Booking is created.
  // ---------------------------------------------------------------------------

  const estimatedTotal =
    pricePerSeat * seats;

  return (
    <section
      aria-labelledby="journey-booking-selection-title"
      className={cn(
        "w-full",
        "rounded-[var(--radius-xl)]",
        "border",
        "border-[var(--border-subtle)]",
        "bg-[var(--background)]",
        "p-4",
        "shadow-[var(--shadow-sm)]",
        "sm:p-5",
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Heading                                                             */}
      {/* ------------------------------------------------------------------- */}

      <div>
        <p
          className={cn(
            "text-xs",
            "font-semibold",
            "uppercase",
            "tracking-wide",
            "text-[var(--brand)]",
          )}
        >
          Booking
        </p>

        <h2
          id="journey-booking-selection-title"
          className={cn(
            "mt-1",
            "text-base",
            "font-semibold",
            "text-[var(--foreground)]",
          )}
        >
          Choose your seats
        </h2>

        <p
          className={cn(
            "mt-1",
            "text-sm",
            "text-[var(--foreground-muted)]",
          )}
        >
          Select the number of seats you want to book for this
          Journey.
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Seat Selection                                                      */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "mt-4",
          "flex",
          "items-center",
          "justify-between",
          "gap-4",
          "rounded-[var(--radius-md)]",
          "border",
          "border-[var(--border-subtle)]",
          "bg-[var(--background-subtle)]",
          "px-3",
          "py-3",
        )}
      >
        <div className="min-w-0">
          <p
            className={cn(
              "text-sm",
              "font-medium",
              "text-[var(--foreground)]",
            )}
          >
            Seats
          </p>

          <p
            className={cn(
              "mt-0.5",
              "text-xs",
              "text-[var(--foreground-muted)]",
            )}
          >
            {availableSeats}{" "}
            {availableSeats === 1
              ? "seat"
              : "seats"}{" "}
            available
          </p>
        </div>

        <div
          className={cn(
            "flex",
            "shrink-0",
            "items-center",
            "gap-3",
          )}
          aria-label="Seat quantity"
        >
          <button
            type="button"
            onClick={() =>
              onSeatsChange(
                Math.max(1, seats - 1),
              )
            }
            disabled={!canDecrease}
            aria-label="Decrease number of seats"
            className={cn(
              "flex",
              "h-9",
              "w-9",
              "items-center",
              "justify-center",
              "rounded-[var(--radius-sm)]",
              "border",
              "border-[var(--border)]",
              "bg-[var(--background)]",
              "text-lg",
              "leading-none",
              "text-[var(--foreground)]",
              "transition-colors",
              "hover:bg-[var(--background-muted)]",
              "disabled:cursor-not-allowed",
              "disabled:opacity-40",
            )}
          >
            −
          </button>

          <span
            aria-live="polite"
            aria-label={`${seats} ${
              seats === 1 ? "seat" : "seats"
            } selected`}
            className={cn(
              "min-w-6",
              "text-center",
              "text-base",
              "font-semibold",
              "text-[var(--foreground)]",
            )}
          >
            {seats}
          </span>

          <button
            type="button"
            onClick={() =>
              onSeatsChange(
                Math.min(
                  availableSeats,
                  seats + 1,
                ),
              )
            }
            disabled={!canIncrease}
            aria-label="Increase number of seats"
            className={cn(
              "flex",
              "h-9",
              "w-9",
              "items-center",
              "justify-center",
              "rounded-[var(--radius-sm)]",
              "border",
              "border-[var(--border)]",
              "bg-[var(--background)]",
              "text-lg",
              "leading-none",
              "text-[var(--foreground)]",
              "transition-colors",
              "hover:bg-[var(--background-muted)]",
              "disabled:cursor-not-allowed",
              "disabled:opacity-40",
            )}
          >
            +
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Availability                                                        */}
      {/* ------------------------------------------------------------------- */}

      {!isAvailable ? (
        <div
          role="alert"
          className={cn(
            "mt-3",
            "rounded-[var(--radius-md)]",
            "border",
            "border-[var(--danger)]",
            "bg-[var(--danger-soft)]",
            "px-3",
            "py-2.5",
          )}
        >
          <p
            className={cn(
              "text-sm",
              "font-medium",
              "text-[var(--danger)]",
            )}
          >
            This Journey has no available seats.
          </p>
        </div>
      ) : null}

      {isAvailable &&
      seats > availableSeats ? (
        <div
          role="alert"
          className={cn(
            "mt-3",
            "rounded-[var(--radius-md)]",
            "border",
            "border-[var(--danger)]",
            "bg-[var(--danger-soft)]",
            "px-3",
            "py-2.5",
          )}
        >
          <p
            className={cn(
              "text-sm",
              "font-medium",
              "text-[var(--danger)]",
            )}
          >
            The selected number of seats is no longer
            available.
          </p>
        </div>
      ) : null}

      {/* ------------------------------------------------------------------- */}
      {/* Booking Review                                                      */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "mt-4",
          "border-t",
          "border-[var(--border-subtle)]",
          "pt-4",
        )}
      >
        <div
          className={cn(
            "flex",
            "items-center",
            "justify-between",
            "gap-4",
          )}
        >
          <span
            className={cn(
              "text-sm",
              "text-[var(--foreground-muted)]",
            )}
          >
            Price per seat
          </span>

          <span
            className={cn(
              "text-sm",
              "font-medium",
              "text-[var(--foreground)]",
            )}
          >
            {formatAmount(
              pricePerSeat,
              currency,
            )}
          </span>
        </div>

        <div
          className={cn(
            "mt-2",
            "flex",
            "items-center",
            "justify-between",
            "gap-4",
          )}
        >
          <span
            className={cn(
              "text-sm",
              "text-[var(--foreground-muted)]",
            )}
          >
            Seats
          </span>

          <span
            className={cn(
              "text-sm",
              "font-medium",
              "text-[var(--foreground)]",
            )}
          >
            {seats}
          </span>
        </div>

        <div
          className={cn(
            "mt-3",
            "flex",
            "items-center",
            "justify-between",
            "gap-4",
            "border-t",
            "border-[var(--border-subtle)]",
            "pt-3",
          )}
        >
          <span
            className={cn(
              "text-sm",
              "font-semibold",
              "text-[var(--foreground)]",
            )}
          >
            Journey amount
          </span>

          <span
            className={cn(
              "text-base",
              "font-semibold",
              "text-[var(--foreground)]",
            )}
          >
            {formatAmount(
              estimatedTotal,
              currency,
            )}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Mutation Error                                                      */}
      {/* ------------------------------------------------------------------- */}

      {error ? (
        <div
          role="alert"
          className={cn(
            "mt-4",
            "rounded-[var(--radius-md)]",
            "border",
            "border-[var(--danger)]",
            "bg-[var(--danger-soft)]",
            "px-3",
            "py-2.5",
          )}
        >
          <p
            className={cn(
              "text-sm",
              "font-medium",
              "text-[var(--danger)]",
            )}
          >
            {error.message ||
              "We could not create your booking."}
          </p>
        </div>
      ) : null}

      {/* ------------------------------------------------------------------- */}
      {/* Submit                                                              */}
      {/* ------------------------------------------------------------------- */}

      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitDisabled}
        className={cn(
          "mt-5",
          "flex",
          "w-full",
          "items-center",
          "justify-center",
          "rounded-[var(--radius-md)]",
          "bg-[var(--brand)]",
          "px-4",
          "py-3",
          "text-sm",
          "font-semibold",
          "text-[var(--brand-foreground)]",
          "transition-colors",
          "hover:bg-[var(--brand-hover)]",
          "disabled:cursor-not-allowed",
          "disabled:opacity-50",
        )}
      >
        {isSubmitting
          ? "Creating booking…"
          : "Confirm booking"}
      </button>

      {/* ------------------------------------------------------------------- */}
      {/* Supporting Note                                                     */}
      {/* ------------------------------------------------------------------- */}

      <p
        className={cn(
          "mt-3",
          "text-center",
          "text-xs",
          "leading-5",
          "text-[var(--foreground-muted)]",
        )}
      >
        The booking will use the Journey details currently
        published by the provider.
      </p>
    </section>
  );
}

export default JourneyBookingSelection;
