
 // -----------------------------------------------------------------------------
// sisiMove — Payment Result
// -----------------------------------------------------------------------------
//
// Presentation component for the terminal state of a financial payment.
//
// Responsibilities:
// - Present a successful or failed payment outcome.
// - Animate the success circle and check mark.
// - Display a human-readable message.
// - Display the payment reference when supplied.
// - Expose optional actions supplied by the parent.
//
// Payment lifecycle decisions remain in the application layer.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

export type PaymentResultStatus = 'success' | 'failed';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface PaymentResultProps {
  status: PaymentResultStatus;
  title?: string;
  message?: string;
  paymentReference?: string;
  actions?: ReactNode;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentResult({
  status,
  title,
  message,
  paymentReference,
  actions,
}: PaymentResultProps) {
  const isSuccessful = status === 'success';

  const resolvedTitle =
    title ??
    (isSuccessful
      ? 'Your payment was successful'
      : 'Your payment was unsuccessful');

  const resolvedMessage =
    message ??
    (isSuccessful
      ? 'Thank you for your payment.'
      : 'We could not complete your payment. Please try again.');

  return (
    <section
      aria-labelledby="payment-result-title"
      aria-live="polite"
      className="surface rounded-[var(--radius-lg)] p-6 text-center sm:p-8"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Animated payment status                                             */}
      {/* ------------------------------------------------------------------- */}

      <div className="flex justify-center">
        {isSuccessful ? (
          <div
            className="payment-success-circle"
            role="img"
            aria-label="Payment successful"
          >
            <svg
              viewBox="0 0 64 64"
              className="payment-success-check"
              aria-hidden="true"
            >
              <path
                d="M14 33 L27 46 L51 17"
                fill="none"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="payment-success-check-path"
              />
            </svg>
          </div>
        ) : (
          <div
            className="payment-failed-circle"
            role="img"
            aria-label="Payment unsuccessful"
          >
            <svg
              viewBox="0 0 64 64"
              className="h-12 w-12"
              aria-hidden="true"
            >
              <path
                d="M21 21 L43 43 M43 21 L21 43"
                fill="none"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Result message                                                      */}
      {/* ------------------------------------------------------------------- */}

      <div className="mx-auto mt-5 max-w-sm">
        <h2
          id="payment-result-title"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          {resolvedTitle}
        </h2>

        <p className="mt-1.5 text-sm leading-6 text-[var(--foreground-secondary)]">
          {resolvedMessage}
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Payment reference                                                   */}
      {/* ------------------------------------------------------------------- */}

      {paymentReference ? (
        <div className="mx-auto mt-5 max-w-sm rounded-[var(--radius-md)] bg-[var(--background-subtle)] px-3 py-2.5 text-left">
          <p className="text-xs font-medium text-[var(--foreground-muted)]">
            Payment reference
          </p>

          <p className="mt-1 break-all text-sm font-medium text-[var(--foreground)]">
            {paymentReference}
          </p>
        </div>
      ) : null}

      {/* ------------------------------------------------------------------- */}
      {/* Parent-provided actions                                             */}
      {/* ------------------------------------------------------------------- */}

      {actions ? (
        <div className="mx-auto mt-6 flex max-w-sm flex-col gap-2 sm:flex-row sm:justify-center">
          {actions}
        </div>
      ) : null}

      {/* ------------------------------------------------------------------- */}
      {/* Component animations                                                */}
      {/* ------------------------------------------------------------------- */}

      <style>{`
        .payment-success-circle {
          width: 74px;
          height: 74px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          background: var(--success);
          animation: payment-circle-appear 450ms ease-out both;
        }

        .payment-success-check {
          width: 52px;
          height: 52px;
          overflow: visible;
        }

        .payment-success-check-path {
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: payment-check-draw 550ms 250ms ease-out forwards;
        }

        .payment-failed-circle {
          width: 74px;
          height: 74px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          background: var(--danger);
        }

        @keyframes payment-circle-appear {
          0% {
            opacity: 0;
            transform: scale(0.45);
          }
          70% {
            opacity: 1;
            transform: scale(1.08);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes payment-check-draw {
          to {
            stroke-dashoffset: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .payment-success-circle,
          .payment-success-check-path {
            animation: none;
          }

          .payment-success-circle {
            opacity: 1;
            transform: none;
          }

          .payment-success-check-path {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </section>
  );
}
