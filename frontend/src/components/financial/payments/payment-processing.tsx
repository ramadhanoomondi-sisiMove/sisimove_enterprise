// -----------------------------------------------------------------------------
// sisiMove — Payment Processing
// -----------------------------------------------------------------------------
//
// Presentation component for the payment-processing state.
//
// Responsibilities:
// - Communicate that the top-up is currently being processed.
// - Provide a clear, calm progress state.
// - Optionally display supporting information supplied by the parent.
//
// Architecture:
//
//     Payment Container / Page
//              │
//              ▼
//     PaymentProcessing
//              │
//              └── Spinner
//
// This component intentionally does NOT:
// - initiate a payment;
// - poll payment status;
// - call payment APIs;
// - mutate payment state;
// - navigate;
// - determine whether a payment has succeeded or failed.
//
// Payment lifecycle decisions belong to the application layer.
// This component only represents the current processing state.
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
  title = 'Processing payment',
  message = 'Please wait while we confirm your top-up.',
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
      {/* Processing message                                                  */}
      {/* ------------------------------------------------------------------- */}
      <div className="mx-auto mt-4 max-w-sm">
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          {title}
        </h2>

        <p className="mt-1.5 text-sm leading-6 text-[var(--foreground-secondary)]">
          {message}
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