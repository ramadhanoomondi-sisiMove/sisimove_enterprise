
import { cn } from '@/foundation/utils/cn';

export interface AccountHoldAmountProps {
  amount: number;
  currency: string;
  compact?: boolean;
  className?: string;
}

export function AccountHoldAmount({
  amount,
  currency,
  compact = false,
  className,
}: AccountHoldAmountProps) {
  const formattedAmount = new Intl.NumberFormat('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    notation: compact ? 'compact' : 'standard',
  }).format(amount);

  return (
    <span
      className={cn(
        'inline-flex items-baseline gap-1.5',
        'whitespace-nowrap tabular-nums',
        className,
      )}
      title={`${currency} ${new Intl.NumberFormat('en-KE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)}`}
    >
      <span className="text-xs font-medium text-[var(--foreground-muted)]">
        {currency}
      </span>
      <span className="font-semibold text-[var(--foreground)]">
        {formattedAmount}
      </span>
    </span>
  );
}
