// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Amount
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Format payment amounts consistently with financial transactions.
// - Use integer minor units by default.
// - Support major units explicitly when required.
// - Reuse shared currency formatters.
//
// Monetary convention:
// API amounts are integer minor units.
//
// Example:
// 1260 minor units → KES 12.60
// -----------------------------------------------------------------------------

import type { HTMLAttributes } from 'react';

import {
  formatCurrency,
  formatCurrencyMinorUnits,
} from '@/foundation/formatters/currency';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentAmountProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  amount: number;
  currency: string;
  /** Set false only when the supplied amount is already in major units. */
  minorUnits?: boolean;
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function formatPaymentAmount(
  amount: number,
  currency: string,
  minorUnits: boolean,
): string {
  const normalizedCurrency = currency.trim().toUpperCase();

  if (!normalizedCurrency || !Number.isFinite(amount)) {
    return '—';
  }

  if (minorUnits && !Number.isSafeInteger(amount)) {
    return '—';
  }

  try {
    return minorUnits
      ? formatCurrencyMinorUnits(amount, normalizedCurrency)
      : formatCurrency(amount, normalizedCurrency);
  } catch {
    return '—';
  }
}

// -----------------------------------------------------------------------------
// PaymentAmount
// -----------------------------------------------------------------------------

export function PaymentAmount({
  amount,
  currency,
  minorUnits = true,
  className,
  ...props
}: PaymentAmountProps) {
  return (
    <span
      {...props}
      className={className}
      dir="auto"
    >
      {formatPaymentAmount(amount, currency, minorUnits)}
    </span>
  );
}

export default PaymentAmount;
