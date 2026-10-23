// src/features/admin/boardings/overview/BoardingMetricCard.tsx

import type { ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

export interface BoardingMetricCardProps {
  label: string;
  value: number | string;
  description?: string;
  icon?: ReactNode;
  className?: string;
  accent?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
}

const accentClasses = {
  default: {
    icon: 'bg-[var(--background-muted)] text-[var(--foreground-secondary)]',
    value: 'text-[var(--foreground)]',
  },
  brand: {
    icon: 'bg-[var(--brand-soft)] text-[var(--brand)]',
    value: 'text-[var(--brand)]',
  },
  success: {
    icon: 'bg-[var(--success-soft)] text-[var(--success)]',
    value: 'text-[var(--success)]',
  },
  warning: {
    icon: 'bg-[var(--warning-soft)] text-[var(--warning)]',
    value: 'text-[var(--warning)]',
  },
  danger: {
    icon: 'bg-[var(--danger-soft)] text-[var(--danger)]',
    value: 'text-[var(--danger)]',
  },
} as const;

export function BoardingMetricCard({
  label,
  value,
  description,
  icon,
  className,
  accent = 'default',
}: BoardingMetricCardProps) {
  const styles = accentClasses[accent];

  const displayValue =
    typeof value === 'number' ? value.toLocaleString() : value;

  return (
    <article
      className={cn(
        'min-w-0 rounded-[var(--radius-xl)] border border-[var(--border)]',
        'bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)] sm:p-5',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[var(--foreground-secondary)]">
          {label}
        </p>

        {icon && (
          <span
            aria-hidden="true"
            className={cn(
              'inline-flex h-10 w-10 shrink-0 items-center justify-center',
              'rounded-[var(--radius-lg)]',
              styles.icon,
            )}
          >
            {icon}
          </span>
        )}
      </div>

      <p
        className={cn(
          'mt-4 break-words text-2xl font-semibold tracking-tight sm:text-3xl',
          styles.value,
        )}
      >
        {displayValue}
      </p>

      {description && (
        <p className="mt-2 text-xs leading-5 text-[var(--foreground-muted)]">
          {description}
        </p>
      )}
    </article>
  );
}
