// src/features/journey-booking/components/create/journey-booking-pricing.tsx

// -----------------------------------------------------------------------------
// sisiMove — Journey Booking Pricing
// -----------------------------------------------------------------------------
//
// Step 3 of the Journey Booking workflow.
//
// Displays the booking pricing breakdown for the selected number of seats.
//
// Presentation only:
// - No API calls
// - No payment processing
// - No booking state transitions
//
// The parent JourneyBookingForm owns persistence and workflow orchestration.
// -----------------------------------------------------------------------------

"use client";

import { cn } from "@/foundation/utils/cn";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyBookingPricingValues {
  readonly pricePerSeat: number;
  readonly seats: number;
  readonly subtotal: number;
  readonly discountAmount?: number;
  readonly adjustmentAmount?: number;
  readonly totalAmount: number;
  readonly currency: string;
}

export interface JourneyBookingPricingProps {
  readonly values: JourneyBookingPricingValues;
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

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBookingPricing({
  values,
  disabled = false,
  className,
}: JourneyBookingPricingProps) {
  const hasDiscount =
    values.discountAmount !== undefined &&
    values.discountAmount !== 0;

  const hasAdjustment =
    values.adjustmentAmount !== undefined &&
    values.adjustmentAmount !== 0;

  return (
    <section
      aria-labelledby="journey-booking-pricing-title"
      className={cn(
        "space-y-6",
        disabled && "opacity-60",
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">
          Step 3
        </p>

        <h2
          id="journey-booking-pricing-title"
          className="mt-2 text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-2xl"
        >
          Review your price
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)]">
          Review the price for your selected seats before
          continuing to payment.
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Pricing Card                                                        */}
      {/* ------------------------------------------------------------------- */}

      <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
        {/* Price per seat */}

        <div className="flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] p-5 sm:p-6">
          <div>
            <p className="text-sm font-medium text-[var(--foreground)]">
              Price per seat
            </p>

            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              {values.seats}{" "}
              {values.seats === 1 ? "seat" : "seats"}
            </p>
          </div>

          <p className="text-right text-sm font-semibold text-[var(--foreground)]">
            {formatMoney(
              values.pricePerSeat,
              values.currency,
            )}
          </p>
        </div>

        {/* Subtotal */}

        <div className="flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] p-5 sm:p-6">
          <span className="text-sm text-[var(--foreground-secondary)]">
            Subtotal
          </span>

          <span className="text-sm font-medium text-[var(--foreground)]">
            {formatMoney(
              values.subtotal,
              values.currency,
            )}
          </span>
        </div>

        {/* Discount */}

        {hasDiscount && (
          <div className="flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] p-5 sm:p-6">
            <span className="text-sm text-[var(--success)]">
              Discount
            </span>

            <span className="text-sm font-medium text-[var(--success)]">
              −
              {formatMoney(
                Math.abs(values.discountAmount ?? 0),
                values.currency,
              )}
            </span>
          </div>
        )}

        {/* Adjustment */}

        {hasAdjustment && (
          <div className="flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] p-5 sm:p-6">
            <span className="text-sm text-[var(--foreground-secondary)]">
              Adjustment
            </span>

            <span className="text-sm font-medium text-[var(--foreground)]">
              {formatMoney(
                values.adjustmentAmount ?? 0,
                values.currency,
              )}
            </span>
          </div>
        )}

        {/* Total */}

        <div className="bg-[var(--background-subtle)] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-base font-bold text-[var(--foreground)]">
                Total
              </p>

              <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                Amount due for this booking
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

      {/* ------------------------------------------------------------------- */}
      {/* Pricing Notice                                                      */}
      {/* ------------------------------------------------------------------- */}

      <div className="flex items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] p-4">
        <div
          aria-hidden="true"
          className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]"
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            className="size-4"
          >
            <path
              d="M10 8.25v5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle
              cx="10"
              cy="5.75"
              r=".75"
              fill="currentColor"
            />
          </svg>
        </div>

        <p className="text-sm leading-5 text-[var(--foreground-secondary)]">
          Your booking total is based on{" "}
          <span className="font-medium text-[var(--foreground)]">
            {values.seats}{" "}
            {values.seats === 1 ? "seat" : "seats"}
          </span>
          .
        </p>
      </div>
    </section>
  );
}