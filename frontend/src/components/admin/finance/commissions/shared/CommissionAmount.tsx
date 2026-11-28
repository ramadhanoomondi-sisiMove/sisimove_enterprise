
 // src/components/admin/commissions/shared/CommissionAmount.tsx

import {
  formatCurrencyMinorUnits,
} from '@/foundation/formatters/currency';

export interface CommissionAmountProps {
  readonly amount: number;
  readonly currency?: string;
  readonly className?: string;
}

export function CommissionAmount({
  amount,
  currency = 'KES',
  className,
}: CommissionAmountProps) {
  return (
    <span
      className={[
        'inline-flex',
        'font-medium',
        'tabular-nums',
        'text-[var(--foreground)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {Number.isFinite(amount)
        ? formatCurrencyMinorUnits(amount, currency)
        : '—'}
    </span>
  );
}
