
import { formatCurrencyMinorUnits } from '@/foundation/formatters/currency';

import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface WithdrawalAmountProps {
  amount: number;
  currency?: string;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function WithdrawalAmount({
  amount,
  currency = 'KES',
  className,
}: WithdrawalAmountProps) {
  const formattedAmount = formatCurrencyMinorUnits(amount, currency);

  return (
    <span className={cn('font-medium tabular-nums', className)}>
      {formattedAmount}
    </span>
  );
}

export default WithdrawalAmount;
