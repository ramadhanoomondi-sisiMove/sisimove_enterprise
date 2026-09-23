// -----------------------------------------------------------------------------
// sisiMove — Payment Summary
// -----------------------------------------------------------------------------
//
// Presentation component for the financial top-up flow.
//
// Responsibilities:
// - Present the monetary breakdown before a payment is submitted.
// - Display amount, fee, and total using the shared FinancialAmount component.
// - Keep all monetary values in integer minor units.
// - Provide a compact, mobile-first visual hierarchy.
//
// Architecture:
//
//     Payment Container / Page
//              │
//              ▼
//     PaymentSummary
//              │
//              ▼
//     FinancialAmount
//
// This component intentionally does NOT:
// - fetch payment data;
// - calculate fees;
// - submit payments;
// - navigate;
// - own application state;
// - call financial APIs.
//
// Fee calculation belongs to the application/domain boundary.
// Formatting belongs to the shared financial presentation layer.
//
// Monetary convention:
// - amount = integer minor units
// - fee    = integer minor units
// - total  = integer minor units
//
// Example for KES:
//     1 KES    = 100 minor units
//     KES 500  = 50_000
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { FinancialAmount } from '../shared/financial-amount';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface PaymentSummaryProps {
  /**
   * Amount the member intends to add to their sisiMove wallet.
   *
   * Integer minor units.
   */
  amount: number;

  /**
   * Payment fee associated with the top-up.
   *
   * Integer minor units.
   */
  fee: number;

  /**
   * Final amount to be charged.
   *
   * Integer minor units.
   *
   * This value should come from the application/application-flow boundary
   * rather than being calculated by the presentation component.
   */
  total: number;

  /**
   * Currency displayed for all monetary values.
   *
   * Defaults to KES because sisiMove is currently Kenya-first.
   */
  currency?: string;

  /**
   * Optional supporting content supplied by the parent composition.
   *
   * This allows the parent to provide contextual payment information without
   * coupling this component to a specific payment provider.
   */
  footer?: ReactNode;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentSummary({
  amount,
  fee,
  total,
  currency = 'KES',
  footer,
}: PaymentSummaryProps) {
  return (
    <section
      aria-labelledby="payment-summary-title"
      className="surface rounded-[var(--radius-lg)] p-4 sm:p-5"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Section heading                                                     */}
      {/* ------------------------------------------------------------------- */}
      <div>
        <h2
          id="payment-summary-title"
          className="text-sm font-semibold text-[var(--foreground)]"
        >
          Top-up summary
        </h2>

        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Review the amount before continuing.
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Monetary breakdown                                                  */}
      {/* ------------------------------------------------------------------- */}
      <dl className="mt-5 space-y-3">
        {/* Amount ----------------------------------------------------------- */}
        <div className="flex items-center justify-between gap-4">
          <dt className="text-sm text-[var(--foreground-secondary)]">
            Amount
          </dt>

          <dd className="text-sm font-medium text-[var(--foreground)]">
            <FinancialAmount amount={amount} currency={currency} />
          </dd>
        </div>

        {/* Fee -------------------------------------------------------------- */}
        <div className="flex items-center justify-between gap-4">
          <dt className="text-sm text-[var(--foreground-secondary)]">
            Fee
          </dt>

          <dd className="text-sm font-medium text-[var(--foreground)]">
            <FinancialAmount amount={fee} currency={currency} />
          </dd>
        </div>
      </dl>

      {/* ------------------------------------------------------------------- */}
      {/* Total                                                               */}
      {/* ------------------------------------------------------------------- */}
      <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Total
            </p>

            <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
              Amount charged
            </p>
          </div>

          <p className="text-base font-semibold text-[var(--foreground)] sm:text-lg">
            <FinancialAmount amount={total} currency={currency} />
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Optional contextual footer                                          */}
      {/* ------------------------------------------------------------------- */}
      {footer ? (
        <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
          {footer}
        </div>
      ) : null}
    </section>
  );
}