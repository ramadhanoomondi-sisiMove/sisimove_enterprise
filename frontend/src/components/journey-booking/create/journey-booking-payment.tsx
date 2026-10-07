// src/features/journey-booking/components/create/journey-booking-payment.tsx

// -----------------------------------------------------------------------------
// sisiMove — Journey Booking Payment
// -----------------------------------------------------------------------------
//
// Step 4 of the Journey Booking workflow.
//
// Presents the payment state for the booking and the amount being paid.
//
// Presentation only:
// - No API calls
// - No payment-provider integration
// - No booking state transitions
//
// The parent JourneyBookingForm owns persistence and workflow orchestration.
// -----------------------------------------------------------------------------

"use client";

import { cn } from "@/foundation/utils/cn";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type JourneyBookingPaymentStatus =
  | "PENDING"
  | "AUTHORIZED"
  | "CAPTURED"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export interface JourneyBookingPaymentValues {
  readonly amount: number;
  readonly currency: string;
  readonly status?: JourneyBookingPaymentStatus;
  readonly transactionPublicId?: string | null;
}

export interface JourneyBookingPaymentProps {
  readonly values: JourneyBookingPaymentValues;
  readonly onPaymentReady?: () => void;
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

export function JourneyBookingPayment({
  values,
  onPaymentReady,
  disabled = false,
  className,
}: JourneyBookingPaymentProps) {
  const status = values.status ?? "PENDING";

  return (
    <section
      aria-labelledby="journey-booking-payment-title"
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
          Step 4
        </p>

        <h2
          id="journey-booking-payment-title"
          className="mt-2 text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-2xl"
        >
          Payment
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)]">
          Review the amount required for your booking before
          continuing.
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Payment Summary                                                     */}
      {/* ------------------------------------------------------------------- */}

      <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
        <div className="p-5 sm:p-6">
          <p className="text-xs font-medium text-[var(--foreground-muted)]">
            Amount
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)]">
            {formatMoney(
              values.amount,
              values.currency,
            )}
          </p>

          <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
            {values.currency}
          </p>
        </div>

        <div className="border-t border-[var(--border-subtle)] bg-[var(--background-subtle)] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-[var(--foreground-muted)]">
              Payment status
            </span>

            <span
              className={cn(
                "inline-flex items-center rounded-[var(--radius-full)] px-3 py-1",
                "text-xs font-semibold",
                status === "CAPTURED" &&
                  "bg-[var(--success-soft)] text-[var(--success)]",
                status === "FAILED" &&
                  "bg-[var(--danger-soft)] text-[var(--danger)]",
                status !== "CAPTURED" &&
                  status !== "FAILED" &&
                  "bg-[var(--warning-soft)] text-[var(--warning)]",
              )}
            >
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Payment Information                                                 */}
      {/* ------------------------------------------------------------------- */}

      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand-soft)] text-[var(--brand)]"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              className="size-5"
            >
              <rect
                x="3"
                y="5"
                width="14"
                height="10"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />

              <path
                d="M3 8h14"
                stroke="currentColor"
                strokeWidth="1.5"
              />

              <path
                d="M6 12h3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Payment processing
            </h3>

            <p className="mt-1 text-sm leading-5 text-[var(--foreground-secondary)]">
              Your payment will be associated with this
              Journey Booking. Payment processing remains
              subject to the configured payment workflow.
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Continue Action                                                     */}
      {/* ------------------------------------------------------------------- */}

      {onPaymentReady ? (
        <button
          type="button"
          onClick={onPaymentReady}
          disabled={disabled}
          className={cn(
            "w-full rounded-[var(--radius-md)] px-5 py-3",
            "text-sm font-semibold",
            "bg-[var(--brand)] text-[var(--brand-foreground)]",
            "shadow-[var(--shadow-sm)]",
            "transition-colors",
            "hover:bg-[var(--brand-hover)]",
            "disabled:cursor-not-allowed disabled:opacity-60",
          )}
        >
          Continue to review
        </button>
      ) : null}
    </section>
  );
}