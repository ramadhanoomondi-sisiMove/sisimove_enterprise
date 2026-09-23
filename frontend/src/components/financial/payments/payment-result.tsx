// -----------------------------------------------------------------------------
// sisiMove — Payment Result
// -----------------------------------------------------------------------------
//
// Presentation component for the terminal state of a financial payment.
//
// Responsibilities:
// - Present a successful, failed, or otherwise terminal payment outcome.
// - Display the payment reference when supplied.
// - Display a human-readable message.
// - Expose optional actions supplied by the parent.
//
// Architecture:
//
//     Payment Container / Page
//              │
//              ▼
//        PaymentResult
//              │
//              ├── status presentation
//              └── parent-provided actions
//
// This component intentionally does NOT:
// - determine payment status;
// - fetch payment state;
// - retry a payment;
// - navigate;
// - mutate financial data;
// - call payment APIs.
//
// The application layer owns payment lifecycle decisions.
// The parent composition decides which actions are available for the result.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { Badge } from '@/components/ui';

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

export type PaymentResultStatus = 'success' | 'failed';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface PaymentResultProps {
  /**
   * Terminal payment outcome.
   */
  status: PaymentResultStatus;

  /**
   * Human-readable result title.
   *
   * Defaults are provided by the component, but the parent may override them
   * when the application has more specific wording.
   */
  title?: string;

  /**
   * Human-readable explanation of the payment outcome.
   */
  message?: string;

  /**
   * Optional payment public reference.
   *
   * This should be a safe public identifier, never an internal database ID.
   */
  paymentReference?: string;

  /**
   * Optional actions supplied by the parent.
   *
   * Examples:
   * - View wallet
   * - Try again
   * - Return to payments
   */
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
    title ?? (isSuccessful ? 'Top-up successful' : 'Top-up unsuccessful');

  const resolvedMessage =
    message ??
    (isSuccessful
      ? 'Your wallet top-up has been completed.'
      : 'We could not complete your wallet top-up.');

  return (
    <section
      aria-labelledby="payment-result-title"
      className="surface rounded-[var(--radius-lg)] p-6 text-center sm:p-8"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Status indicator                                                    */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex justify-center">
        <Badge variant={isSuccessful ? 'success' : 'danger'}>
          {isSuccessful ? 'Successful' : 'Failed'}
        </Badge>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Result message                                                      */}
      {/* ------------------------------------------------------------------- */}
      <div className="mx-auto mt-4 max-w-sm">
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
    </section>
  );
}