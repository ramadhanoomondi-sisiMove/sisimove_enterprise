
import type { ReactNode } from 'react';

import { Card } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';

export type TransactionMetricTone =
  | 'default'
  | 'brand'
  | 'success'
  | 'warning'
  | 'danger';

export interface TransactionMetricCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  tone?: TransactionMetricTone;
  className?: string;
}

const toneClasses: Record<TransactionMetricTone, string> = {
  default:
    'bg-[var(--background-muted)] text-[var(--foreground-secondary)]',
  brand: 'bg-[var(--brand-soft)] text-[var(--brand)]',
  success: 'bg-[var(--success-soft)] text-[var(--success)]',
  warning: 'bg-[var(--warning-soft)] text-[var(--warning)]',
  danger: 'bg-[var(--danger-soft)] text-[var(--danger)]',
};

export function TransactionMetricCard({
  label,
  value,
  description,
  icon,
  tone = 'default',
  className,
}: TransactionMetricCardProps) {
  const displayValue =
    typeof value === 'number'
      ? new Intl.NumberFormat('en-KE').format(value)
      : value;

  return (
    <Card
      padding="md"
      className={cn('min-w-0 sm:p-5', className)}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium leading-5 text-[var(--foreground-muted)]">
          {label}
        </p>

        <span
          aria-hidden="true"
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center',
            'rounded-[var(--radius-lg)]',
            toneClasses[tone],
          )}
        >
          {icon}
        </span>
      </div>

      <p className="mt-4 break-words text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
        {displayValue}
      </p>

      {description ? (
        <p className="mt-2 text-xs leading-5 text-[var(--foreground-muted)]">
          {description}
        </p>
      ) : null}
    </Card>
  );
}

export default TransactionMetricCard;
