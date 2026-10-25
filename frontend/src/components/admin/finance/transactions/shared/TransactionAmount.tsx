
import { cn } from '@/foundation/utils/cn';

export interface TransactionAmountProps {
  /** Amount returned by the API in major currency units. */
  amount: number;
  currency: string;
  className?: string;
  locale?: string;
}

export function formatTransactionAmount(
  amount: number,
  currency: string,
  locale = 'en-KE',
): string {
  const normalizedCurrency = currency.trim().toUpperCase();

  if (!Number.isFinite(amount) || !normalizedCurrency) {
    return `${amount} ${normalizedCurrency}`;
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: normalizedCurrency,
    }).format(amount);
  } catch {
    return `${amount} ${normalizedCurrency}`;
  }
}

export function TransactionAmount({
  amount,
  currency,
  className,
  locale = 'en-KE',
}: TransactionAmountProps) {
  const formattedAmount = formatTransactionAmount(
    amount,
    currency,
    locale,
  );

  return (
    <span
      className={cn(
        'whitespace-nowrap tabular-nums font-medium text-[var(--foreground)]',
        className,
      )}
      title={`${amount} ${currency}`}
    >
      {formattedAmount}
    </span>
  );
}

export default TransactionAmount;
