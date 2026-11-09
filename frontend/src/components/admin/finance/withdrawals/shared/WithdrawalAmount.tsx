
import { formatCurrencyMinorUnits } from '@/foundation/formatters/currency';

import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface WithdrawalAmountProps {
  amount: number;
  currency: string;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function WithdrawalAmount({
  amount,
  currency,
  className,
}: WithdrawalAmountProps) {
  const normalizedCurrency = currency.trim().toUpperCase();

  if (!Number.isFinite(amount) || !normalizedCurrency) {
    return (
      <span className={cn('tabular-nums', className)}>
        —
      </span>
    );
  }

  let formattedAmount: string;

  try {
    formattedAmount = formatCurrencyMinorUnits(
      amount,
      normalizedCurrency,
    );
  } catch {
    formattedAmount = `${normalizedCurrency} ${amount.toLocaleString('en-KE')}`;
  }

  return (
    <span
      className={cn(
        'font-medium',
        'tabular-nums',
        'text-[var(--foreground)]',
        className,
      )}
    >
      {formattedAmount}
    </span>
  );
}

export default WithdrawalAmount;
