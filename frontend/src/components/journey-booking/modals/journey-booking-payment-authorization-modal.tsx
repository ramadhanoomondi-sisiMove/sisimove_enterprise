// -----------------------------------------------------------------------------
// sisiMove — Journey Booking Payment Authorization Modal
// -----------------------------------------------------------------------------
//
// Confirmation popup for authorizing payment associated with a Journey
// Booking.
//
// Responsibilities:
// - communicate what payment authorization means;
// - present the authorization request as a modal popup;
// - display the payment amount and optional booking context;
// - provide Confirm and Cancel actions;
// - remain presentation-only;
// - compose the shared Dialog design-system primitive;
// - use Lucide icons for a clean, consistent visual language.
//
// Non-responsibilities:
// - no mutation;
// - no API calls;
// - no payment processing;
// - no financial transaction creation;
// - no navigation;
// - no payment-state mutation;
// - no booking lifecycle decisions.
//
// The owning surface is responsible for invoking the authorization mutation
// after the user confirms.
//
// -----------------------------------------------------------------------------

"use client";

import {
  CheckCircle2,
  CreditCard,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";

import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/foundation/utils/cn";

// =============================================================================
// Props
// =============================================================================

export interface JourneyBookingPaymentAuthorizationModalProps {
  readonly open: boolean;

  readonly onClose: () => void;

  /**
   * Called when the user confirms payment authorization.
   *
   * The owning surface is responsible for performing the actual mutation.
   */
  readonly onConfirm: () => void;

  /**
   * Payment amount displayed to the user.
   *
   * This should already be formatted by the owning surface.
   */
  readonly amount: string;

  /**
   * Optional currency displayed alongside the amount.
   */
  readonly currency?: string;

  /**
   * Optional Journey Booking reference displayed in the confirmation.
   */
  readonly journeyBookingPublicId?: string;

  /**
   * Optional transaction reference displayed in the confirmation.
   */
  readonly transactionPublicId?: string;

  /**
   * Allows the confirm action to be disabled while the owning mutation
   * is processing.
   */
  readonly confirming?: boolean;

  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyBookingPaymentAuthorizationModal({
  open,
  onClose,
  onConfirm,
  amount,
  currency,
  journeyBookingPublicId,
  transactionPublicId,
  confirming = false,
  className,
}: JourneyBookingPaymentAuthorizationModalProps) {
  const displayAmount = currency
    ? `${currency} ${amount}`
    : amount;

  const footer = (
    <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      {/* --------------------------------------------------------------------- */}
      {/* Cancel                                                                */}
      {/* --------------------------------------------------------------------- */}

      <button
        type="button"
        onClick={onClose}
        disabled={confirming}
        className={cn(
          "inline-flex",
          "min-h-10",
          "items-center",
          "justify-center",
          "rounded-[var(--radius-md)]",
          "border",
          "border-[var(--border)]",
          "bg-[var(--surface)]",
          "px-4",
          "py-2",
          "text-sm",
          "font-medium",
          "text-[var(--foreground)]",
          "transition-colors",
          "hover:bg-[var(--background-subtle)]",
          "focus-visible:outline-2",
          "focus-visible:outline-[var(--brand)]",
          "focus-visible:outline-offset-2",
          "disabled:cursor-not-allowed",
          "disabled:opacity-60",
        )}
      >
        Cancel
      </button>

      {/* --------------------------------------------------------------------- */}
      {/* Confirm                                                               */}
      {/* --------------------------------------------------------------------- */}

      <button
        type="button"
        onClick={onConfirm}
        disabled={confirming}
        className={cn(
          "inline-flex",
          "min-h-10",
          "items-center",
          "justify-center",
          "rounded-[var(--radius-md)]",
          "bg-[var(--brand)]",
          "px-4",
          "py-2",
          "text-sm",
          "font-medium",
          "text-[var(--brand-foreground)]",
          "transition-opacity",
          "hover:bg-[var(--brand-hover)]",
          "focus-visible:outline-2",
          "focus-visible:outline-[var(--brand)]",
          "focus-visible:outline-offset-2",
          "disabled:cursor-not-allowed",
          "disabled:opacity-60",
        )}
      >
        {confirming ? (
          <>
            <LoaderCircle
              className="mr-2 h-4 w-4 animate-spin"
              strokeWidth={2}
              aria-hidden="true"
            />
            Authorizing…
          </>
        ) : (
          <>
            <ShieldCheck
              className="mr-2 h-4 w-4"
              strokeWidth={1.9}
              aria-hidden="true"
            />
            Authorize Payment
          </>
        )}
      </button>
    </div>
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !confirming) {
          onClose();
        }
      }}
      title="Authorize Payment"
      description="Review the payment details before authorizing this Journey Booking payment."
      size="sm"
      closeOnBackdropClick={!confirming}
      closeOnEscape={!confirming}
      showCloseButton={!confirming}
      className={className}
      footer={footer}
    >
      <div className="space-y-5">
        {/* ----------------------------------------------------------------- */}
        {/* Payment Header                                                     */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex items-start gap-3">
          <div
            aria-hidden="true"
            className={cn(
              "flex",
              "h-10",
              "w-10",
              "shrink-0",
              "items-center",
              "justify-center",
              "rounded-full",
              "bg-[var(--brand-soft)]",
              "text-[var(--brand)]",
            )}
          >
            <CreditCard
              className="h-5 w-5"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Payment Authorization
            </p>

            <p className="mt-1 text-sm leading-5 text-[var(--foreground-muted)]">
              Review the amount below before authorizing this Journey Booking
              payment.
            </p>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Amount Card                                                        */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={cn(
            "rounded-[var(--radius-lg)]",
            "border",
            "border-[var(--border)]",
            "bg-[var(--background-subtle)]",
            "px-4",
            "py-5",
          )}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                Amount to authorize
              </p>

              <p className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                {displayAmount}
              </p>
            </div>

            <div
              aria-hidden="true"
              className={cn(
                "flex",
                "h-9",
                "w-9",
                "shrink-0",
                "items-center",
                "justify-center",
                "rounded-full",
                "bg-[var(--surface)]",
                "text-[var(--brand)]",
                "shadow-[var(--shadow-sm)]",
              )}
            >
              <CreditCard
                className="h-4 w-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Booking Context                                                    */}
        {/* ----------------------------------------------------------------- */}

        {(journeyBookingPublicId || transactionPublicId) && (
          <div
            className={cn(
              "divide-y",
              "divide-[var(--border-subtle)]",
              "rounded-[var(--radius-lg)]",
              "border",
              "border-[var(--border-subtle)]",
            )}
          >
            {journeyBookingPublicId && (
              <div className="flex items-start justify-between gap-4 px-4 py-3">
                <span className="text-sm text-[var(--foreground-muted)]">
                  Booking
                </span>

                <span className="max-w-[65%] break-all text-right text-sm font-medium text-[var(--foreground)]">
                  {journeyBookingPublicId}
                </span>
              </div>
            )}

            {transactionPublicId && (
              <div className="flex items-start justify-between gap-4 px-4 py-3">
                <span className="text-sm text-[var(--foreground-muted)]">
                  Transaction
                </span>

                <span className="max-w-[65%] break-all text-right text-sm font-medium text-[var(--foreground)]">
                  {transactionPublicId}
                </span>
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Authorization Information                                          */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={cn(
            "flex",
            "items-start",
            "gap-3",
            "rounded-[var(--radius-lg)]",
            "border",
            "border-[var(--border-subtle)]",
            "bg-[var(--background-brand)]",
            "px-4",
            "py-3",
          )}
        >
          <ShieldCheck
            className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brand)]"
            strokeWidth={1.8}
            aria-hidden="true"
          />

          <p className="text-sm leading-5 text-[var(--foreground-secondary)]">
            Authorization confirms that this payment can proceed. It does not
            mean the payment has been captured or settled.
          </p>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Processing State                                                   */}
        {/* ----------------------------------------------------------------- */}

        {confirming && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]"
          >
            <LoaderCircle
              className="h-4 w-4 animate-spin text-[var(--brand)]"
              strokeWidth={2}
              aria-hidden="true"
            />

            <span>Authorizing payment securely…</span>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Ready State                                                        */}
        {/* ----------------------------------------------------------------- */}

        {!confirming && (
          <div className="flex items-center gap-2 text-xs text-[var(--foreground-subtle)]">
            <CheckCircle2
              className="h-4 w-4 text-[var(--success)]"
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <span>Review the details before continuing.</span>
          </div>
        )}
      </div>
    </Dialog>
  );
}