// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Amount
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Format a payment amount consistently using its currency.
// - Support explicit minor-unit conversion when required.
// - Avoid introducing a separate currency-formatting primitive.
// -----------------------------------------------------------------------------

import type { HTMLAttributes } from 'react';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentAmountProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  amount: number;
  currency: string;
  minorUnits?: boolean;
  locale?: string;
  maximumFractionDigits?: number;
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function formatPaymentAmount({
  amount,
  currency,
  minorUnits,
  locale,
  maximumFractionDigits,
}: Pick<
  PaymentAmountProps,
  | 'amount'
  | 'currency'
  | 'minorUnits'
  | 'locale'
  | 'maximumFractionDigits'
>): string {
  const normalizedCurrency = currency.trim().toUpperCase();

  if (!Number.isFinite(amount) || !normalizedCurrency) {
    return '—';
  }

  const displayAmount = minorUnits ? amount / 100 : amount;

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: normalizedCurrency,
      ...(maximumFractionDigits !== undefined
        ? { maximumFractionDigits }
        : {}),
    }).format(displayAmount);
  } catch {
    return `${normalizedCurrency} ${displayAmount.toLocaleString(locale)}`;
  }
}

// -----------------------------------------------------------------------------
// PaymentAmount
// -----------------------------------------------------------------------------

export function PaymentAmount({
  amount,
  currency,
  minorUnits = false,
  locale,
  maximumFractionDigits,
  className,
  ...props
}: PaymentAmountProps) {
  return (
    <span
      {...props}
      className={className}
      dir="auto"
    >
      {formatPaymentAmount({
        amount,
        currency,
        minorUnits,
        locale,
        maximumFractionDigits,
      })}
    </span>
  );
}