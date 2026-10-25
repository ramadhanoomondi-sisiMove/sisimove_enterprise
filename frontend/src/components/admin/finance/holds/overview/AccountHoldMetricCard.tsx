// src/components/admin/finance/account-holds/overview/AccountHoldMetricCard.tsx

import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

export interface AccountHoldMetricCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  className?: string;
}

const toneClasses = {
  default: 'bg-[var(--background-muted)] text-[var(--foreground-secondary)]',
  brand: 'bg-[var(--brand-soft)] text-[var(--brand)]',
  success: 'bg-[var(--success-soft)] text-[var(--success)]',
  warning: 'bg-[var(--warning-soft)] text-[var(--warning)]',
  danger: 'bg-[var(--danger-soft)] text-[var(--danger)]',
} satisfies Record<
  NonNullable<AccountHoldMetricCardProps['tone']>,
  string
>;

export function AccountHoldMetricCard({
  label,
  value,
  description,
  icon: Icon,
  tone = 'default',
  trend,
  className,
}: AccountHoldMetricCardProps) {
  const TrendIcon =
    trend?.direction === 'up'
      ? ArrowUpRight
      : trend?.direction === 'down'
        ? ArrowDownRight
        : Minus;

  return (
    <article
      className={cn(
        'min-w-0 rounded-[var(--radius-xl)] border border-[var(--border)]',
        'bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]',
        'transition-shadow hover:shadow-[var(--shadow-md)]',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--foreground-secondary)]">
            {label}
          </p>

          <p className="mt-3 break-words text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            {value}
          </p>
        </div>

        <span
          className={cn(
            'inline-flex size-11 shrink-0 items-center justify-center',
            'rounded-[var(--radius-lg)]',
            toneClasses[tone],
          )}
        >
          <Icon aria-hidden="true" className="size-5" />
        </span>
      </div>

      {(description || trend) && (
        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1">
          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-1 text-xs font-semibold',
                trend.direction === 'up' &&
                  'text-[var(--success)]',
                trend.direction === 'down' &&
                  'text-[var(--danger)]',
                trend.direction === 'neutral' &&
                  'text-[var(--foreground-muted)]',
              )}
            >
              <TrendIcon aria-hidden="true" className="size-3.5" />
              {trend.value}
            </span>
          )}

          {description && (
            <span className="text-xs text-[var(--foreground-muted)]">
              {description}
            </span>
          )}

          {trend?.label && (
            <span className="text-xs text-[var(--foreground-muted)]">
              {trend.label}
            </span>
          )}
        </div>
      )}
    </article>
  );
}