// src/features/journey-booking/components/create/journey-booking-review.tsx

// -----------------------------------------------------------------------------
// sisiMove — Journey Booking Review
// -----------------------------------------------------------------------------
//
// Step 5 of the Journey Booking workflow.
//
// Presents the final booking summary before the passenger confirms the
// Journey Booking.
//
// Presentation only:
// - No API calls
// - No booking state transitions
// - No payment processing
//
// The parent JourneyBookingForm owns the confirm mutation and workflow
// orchestration.
// -----------------------------------------------------------------------------

"use client";

import { cn } from "@/foundation/utils/cn";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyBookingReviewValues {
  readonly journeyBookingPublicId: string;
  readonly journeyPublicId: string;
  readonly seats: number;

  readonly originName: string;
  readonly destinationName: string;
  readonly departureAt: string;
  readonly arrivalAt?: string | null;
  readonly timezone: string;

  readonly vehicleMake?: string | null;
  readonly vehicleModel?: string | null;
  readonly vehicleColor?: string | null;
  readonly vehicleRegistration?: string | null;

  readonly pricePerSeat: number;
  readonly subtotal: number;
  readonly discountAmount?: number;
  readonly adjustmentAmount?: number;
  readonly totalAmount: number;
  readonly currency: string;
}

export interface JourneyBookingReviewProps {
  readonly values: JourneyBookingReviewValues;
  readonly accepted: boolean;
  readonly onAcceptedChange: (accepted: boolean) => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatMoney(
  amount: number,
  currency: string,
): string {
  try {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function formatDateTime(
  value: string,
  timezone: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  try {
    return new Intl.DateTimeFormat("en-KE", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: timezone,
    }).format(date);
  } catch {
    return value;
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBookingReview({
  values,
  accepted,
  onAcceptedChange,
  disabled = false,
  className,
}: JourneyBookingReviewProps) {
  const vehicleParts = [
    values.vehicleMake,
    values.vehicleModel,
  ].filter(
    (value): value is string =>
      typeof value === "string" &&
      value.trim().length > 0,
  );

  const vehicleName =
    vehicleParts.length > 0
      ? vehicleParts.join(" ")
      : null;

  return (
    <section
      aria-labelledby="journey-booking-review-title"
      className={cn("space-y-6", className)}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">
          Step 5
        </p>

        <h2
          id="journey-booking-review-title"
          className="mt-2 text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-2xl"
        >
          Confirm your booking
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)]">
          Review everything one last time before confirming
          your Journey Booking.
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Journey Summary                                                     */}
      {/* ------------------------------------------------------------------- */}

      <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
        <div className="border-b border-[var(--border-subtle)] p-5 sm:p-6">
          <p className="text-xs font-medium text-[var(--foreground-muted)]">
            Journey
          </p>

          <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
            <p className="font-semibold text-[var(--foreground)]">
              {values.originName}
            </p>

            <span
              aria-hidden="true"
              className="hidden text-[var(--foreground-subtle)] sm:inline"
            >
              →
            </span>

            <p className="font-semibold text-[var(--foreground)]">
              {values.destinationName}
            </p>
          </div>
        </div>

        <div className="grid gap-px bg-[var(--border-subtle)] sm:grid-cols-2">
          <div className="bg-[var(--surface)] p-5">
            <p className="text-xs font-medium text-[var(--foreground-muted)]">
              Departure
            </p>

            <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
              {formatDateTime(
                values.departureAt,
                values.timezone,
              )}
            </p>
          </div>

          <div className="bg-[var(--surface)] p-5">
            <p className="text-xs font-medium text-[var(--foreground-muted)]">
              Seats
            </p>

            <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
              {values.seats}{" "}
              {values.seats === 1 ? "seat" : "seats"}
            </p>
          </div>
        </div>

        {vehicleName !== null && (
          <div className="border-t border-[var(--border-subtle)] p-5">
            <p className="text-xs font-medium text-[var(--foreground-muted)]">
              Vehicle
            </p>

            <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
              {vehicleName}
            </p>

            {(values.vehicleColor ||
              values.vehicleRegistration) && (
              <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                {[
                  values.vehicleColor,
                  values.vehicleRegistration,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Price Summary                                                       */}
      {/* ------------------------------------------------------------------- */}

      <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
        <div className="border-b border-[var(--border-subtle)] p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            Price summary
          </h3>
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-[var(--foreground-secondary)]">
              {values.seats} ×{" "}
              {formatMoney(
                values.pricePerSeat,
                values.currency,
              )}
            </span>

            <span className="font-medium text-[var(--foreground)]">
              {formatMoney(
                values.subtotal,
                values.currency,
              )}
            </span>
          </div>

          {values.discountAmount !== undefined &&
            values.discountAmount !== 0 && (
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-[var(--success)]">
                  Discount
                </span>

                <span className="font-medium text-[var(--success)]">
                  −
                  {formatMoney(
                    Math.abs(values.discountAmount),
                    values.currency,
                  )}
                </span>
              </div>
            )}

          {values.adjustmentAmount !== undefined &&
            values.adjustmentAmount !== 0 && (
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-[var(--foreground-secondary)]">
                  Adjustment
                </span>

                <span className="font-medium text-[var(--foreground)]">
                  {formatMoney(
                    values.adjustmentAmount,
                    values.currency,
                  )}
                </span>
              </div>
            )}

          <div className="border-t border-[var(--border-subtle)] pt-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-[var(--foreground)]">
                  Total
                </p>

                <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                  Booking total
                </p>
              </div>

              <p className="text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-2xl">
                {formatMoney(
                  values.totalAmount,
                  values.currency,
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Final Acceptance                                                    */}
      {/* ------------------------------------------------------------------- */}

      <label
        className={cn(
          "flex cursor-pointer items-start gap-3 rounded-[var(--radius-lg)]",
          "border p-4 transition-colors sm:p-5",
          accepted
            ? "border-[var(--success)] bg-[var(--success-soft)]"
            : "border-[var(--border)] bg-[var(--surface)]",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <input
          type="checkbox"
          checked={accepted}
          onChange={(event) =>
            onAcceptedChange(event.target.checked)
          }
          disabled={disabled}
          className="mt-0.5 size-4 shrink-0 accent-[var(--brand)]"
        />

        <span className="min-w-0">
          <span className="block text-sm font-semibold text-[var(--foreground)]">
            I confirm this booking
          </span>

          <span className="mt-1 block text-sm leading-5 text-[var(--foreground-secondary)]">
            I have reviewed the journey, selected seats,
            pricing, and payment information and want to
            confirm this Journey Booking.
          </span>
        </span>
      </label>
    </section>
  );
}