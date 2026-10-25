
import { cn } from '@/foundation/utils/cn';

export interface TransactionAmountProps {
  /** Amount stored in integer minor units. */
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

  if (!Number.isSafeInteger(amount) || !normalizedCurrency) {
    return `${amount} ${normalizedCurrency}`;
  }

  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: normalizedCurrency,
    });

    const fractionDigits =
      formatter.resolvedOptions().maximumFractionDigits ?? 2;

    return formatter.format(amount / 10 ** fractionDigits);
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
      title={`${amount} minor units (${currency})`}
    >
      {formattedAmount}
    </span>
  );
}

export default TransactionAmount;
