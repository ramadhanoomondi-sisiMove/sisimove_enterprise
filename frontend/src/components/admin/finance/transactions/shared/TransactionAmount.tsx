import { cn } from '@/foundation/utils/cn';
import {
  formatCurrencyMinorUnits,
} from '@/foundation/formatters/currency';

export interface TransactionAmountProps {
  /** Amount returned by the API in integer minor currency units. */
  amount: number;
  currency: string;
  className?: string;
}

/**
 * Formats a transaction amount using the shared minor-unit formatter.
 *
 * API amounts are never converted or modified here.
 *
 * Example:
 * KES 10000 minor units → KES 100.00
 */
export function formatTransactionAmount(
  amount: number,
  currency: string,
): string {
  const normalizedCurrency = currency.trim().toUpperCase();

  if (
    !Number.isSafeInteger(amount) ||
    !normalizedCurrency
  ) {
    return `${amount} ${normalizedCurrency}`;
  }

  try {
    return formatCurrencyMinorUnits(
      amount,
      normalizedCurrency,
    );
  } catch {
    return `${amount} ${normalizedCurrency}`;
  }
}

// -----------------------------------------------------------------------------
// Transaction Amount Component
// -----------------------------------------------------------------------------

export function TransactionAmount({
  amount,
  currency,
  className,
}: TransactionAmountProps) {
  const normalizedCurrency = currency.trim().toUpperCase();

  const formattedAmount = formatTransactionAmount(
    amount,
    normalizedCurrency,
  );

  return (
    <span
      className={cn(
        'whitespace-nowrap tabular-nums font-medium text-[var(--foreground)]',
        className,
      )}
      title={`${amount} ${normalizedCurrency} (minor units)`}
    >
      {formattedAmount}
    </span>
  );
}

export default TransactionAmount;
