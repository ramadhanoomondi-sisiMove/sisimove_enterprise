
// -----------------------------------------------------------------------------
// sisiMove — Payment Processing
// -----------------------------------------------------------------------------
//
// Presentation component for the payment-processing state.
//
// Responsibilities:
// - Communicate that the top-up is awaiting payment authorization.
// - Instruct the member to check their phone for the M-PESA prompt.
// - Clearly explain how to authorize the payment.
// - Provide a calm progress indicator.
// - Optionally display supporting information supplied by the parent.
//
// Architecture:
//
//     Payment Container / Page
//              │
//              ▼
//     PaymentProcessing
//              │
//              ├── Spinner
//              └── Authorization instructions
//
// This component intentionally does NOT:
// - initiate a payment;
// - send an M-PESA prompt;
// - collect or process an M-PESA PIN;
// - poll payment status;
// - call payment APIs;
// - mutate payment state;
// - navigate;
// - determine whether a payment has succeeded or failed.
//
// Payment lifecycle decisions belong to the application layer.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { Spinner } from '@/components/ui';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface PaymentProcessingProps {
  /**
   * Optional title shown above the processing message.
   */
  title?: string;

  /**
   * Optional supporting message.
   */
  message?: string;

  /**
   * Optional contextual content supplied by the parent.
   *
   * This can be used for provider-specific instructions without coupling this
   * component to a payment provider.
   */
  footer?: ReactNode;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentProcessing({
  title = 'Check your phone',
  message = 'A payment request has been sent to your phone. Enter your M-PESA PIN on your phone to authorize the payment. Do not enter or share your PIN in sisiMove.',
  footer,
}: PaymentProcessingProps) {
  return (
    <section
      aria-live="polite"
      aria-busy="true"
      className="surface rounded-[var(--radius-lg)] p-6 text-center sm:p-8"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Processing indicator                                                */}
      {/* ------------------------------------------------------------------- */}

      <div className="flex justify-center">
        <Spinner />
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Authorization instructions                                          */}
      {/* ------------------------------------------------------------------- */}

      <div className="mx-auto mt-4 max-w-sm">
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-[var(--foreground-secondary)]">
          {message}
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Security reminder                                                   */}
      {/* ------------------------------------------------------------------- */}

      <div className="mx-auto mt-5 max-w-sm rounded-[var(--radius-md)] bg-[var(--success-soft)] px-4 py-3 text-left">
        <p className="text-xs font-medium leading-5 text-[var(--success)]">
          Security reminder
        </p>

        <p className="mt-1 text-xs leading-5 text-[var(--foreground-secondary)]">
          Only enter your M-PESA PIN on your phone when responding to the
          official payment prompt. sisiMove will never ask you for your PIN.
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Optional contextual information                                      */}
      {/* ------------------------------------------------------------------- */}

      {footer ? (
        <div className="mx-auto mt-5 max-w-sm border-t border-[var(--border-subtle)] pt-4">
          {footer}
        </div>
      ) : null}
    </section>
  );
}
