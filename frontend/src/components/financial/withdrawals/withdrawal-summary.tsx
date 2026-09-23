import type { ReactNode } from 'react';

import { Card } from '@/components/ui/card';

// -----------------------------------------------------------------------------
// sisiMove — Withdrawal Summary
// -----------------------------------------------------------------------------
//
// Presentation component for the final withdrawal amount summary.
//
// Financial boundary:
//
// FinancialAccountWithdrawal
// ├── amount
// ├── currency
// ├── destinationType
// └── destinationValue
//
// The summary is intentionally separate from WithdrawalForm.
//
// Responsibilities:
// - display the withdrawal amount;
// - display the applicable fee;
// - display the final amount the user will receive;
// - optionally display destination information;
// - display caller-owned supporting information.
//
// This component does NOT:
// - calculate fees;
// - calculate the receive amount;
// - perform currency conversion;
// - validate the withdrawal;
// - fetch account information;
// - execute the withdrawal;
// - interpret backend financial rules.
//
// All financial calculations and authoritative values must be resolved by
// the application/backend boundary and supplied as presentation-ready values.
//
// -----------------------------------------------------------------------------

export interface WithdrawalSummaryProps {
  /**
   * Currency associated with the displayed financial amounts.
   *
   * This is presentation metadata only.
   *
   * Example:
   * "KES"
   */
  readonly currency?: string;

  /**
   * Presentation-ready withdrawal amount.
   *
   * Example:
   * "KES 1,000.00"
   */
  readonly amountLabel: string;

  /**
   * Presentation-ready withdrawal fee.
   *
   * Example:
   * "KES 20.00"
   *
   * The caller must provide the authoritative fee resolved by the
   * application/backend boundary.
   */
  readonly feeLabel: string;

  /**
   * Presentation-ready amount the user will receive.
   *
   * Example:
   * "KES 980.00"
   */
  readonly receiveAmountLabel: string;

  /**
   * Optional presentation-safe destination description.
   *
   * Example:
   * "M-PESA • 0712 ••• 678"
   *
   * Sensitive destination information must already be masked by the caller.
   */
  readonly destinationLabel?: string;

  /**
   * Optional caller-owned supporting information.
   *
   * The summary does not interpret or modify this content.
   */
  readonly supportingContent?: ReactNode;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function WithdrawalSummary({
  currency = 'KES',
  amountLabel,
  feeLabel,
  receiveAmountLabel,
  destinationLabel,
  supportingContent,
}: WithdrawalSummaryProps) {
  return (
    <Card
      variant="outlined"
      padding="md"
      className="w-full"
    >
      <div className="space-y-4">
        {/* ----------------------------------------------------------------- */}
        {/* Header                                                            */}
        {/* ----------------------------------------------------------------- */}
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--foreground-muted)]">
            Withdrawal summary
          </p>

          <h2 className="mt-1 text-base font-semibold text-[var(--foreground)]">
            Review your withdrawal
          </h2>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Financial breakdown                                               */}
        {/* ----------------------------------------------------------------- */}
        <dl className="divide-y divide-[var(--border)]">
          {/* Amount */}
          <div className="flex items-center justify-between gap-4 py-3 first:pt-0">
            <dt className="text-sm text-[var(--foreground-muted)]">
              Amount
            </dt>

            <dd className="text-right text-sm font-medium text-[var(--foreground)]">
              {amountLabel}
            </dd>
          </div>

          {/* Fee */}
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-sm text-[var(--foreground-muted)]">
              Fee
            </dt>

            <dd className="text-right text-sm font-medium text-[var(--foreground)]">
              {feeLabel}
            </dd>
          </div>

          {/* Receive amount */}
          <div className="flex items-end justify-between gap-4 py-4 last:pb-0">
            <dt>
              <span className="block text-sm font-medium text-[var(--foreground-secondary)]">
                You receive
              </span>

              <span className="mt-0.5 block text-xs text-[var(--foreground-muted)]">
                {currency}
              </span>
            </dt>

            <dd className="text-right text-xl font-semibold tracking-tight text-[var(--foreground)]">
              {receiveAmountLabel}
            </dd>
          </div>
        </dl>

        {/* ----------------------------------------------------------------- */}
        {/* Destination                                                       */}
        {/* ----------------------------------------------------------------- */}
        {destinationLabel ? (
          <div className="rounded-lg bg-[var(--background-muted)] px-3 py-2.5">
            <p className="text-xs font-medium uppercase tracking-[0.06em] text-[var(--foreground-muted)]">
              Sending to
            </p>

            <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
              {destinationLabel}
            </p>
          </div>
        ) : null}

        {/* ----------------------------------------------------------------- */}
        {/* Supporting information                                            */}
        {/* ----------------------------------------------------------------- */}
        {supportingContent ? (
          <div>
            {supportingContent}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
