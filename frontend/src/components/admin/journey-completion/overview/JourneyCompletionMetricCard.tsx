
import type { ReactNode } from 'react';
import { cn } from '@/foundation/utils/cn';

export interface JourneyCompletionMetricCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'brand';
  className?: string;
}

const toneClasses: Record<
  NonNullable<JourneyCompletionMetricCardProps['tone']>,
  string
> = {
  default: 'bg-[var(--surface)]',
  success: 'bg-[var(--success-soft)]',
  warning: 'bg-[var(--warning-soft)]',
  danger: 'bg-[var(--danger-soft)]',
  brand: 'bg-[var(--brand-soft)]',
};

export function JourneyCompletionMetricCard({
  label,
  value,
  description,
  icon,
  tone = 'default',
  className,
}: JourneyCompletionMetricCardProps) {
  return (
    <article
      className={cn(
        'min-w-0 rounded-xl border border-[var(--border)] p-4 shadow-sm',
        toneClasses[tone],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[var(--foreground-secondary)]">
          {label}
        </p>

        {icon ? (
          <span className="shrink-0 text-[var(--foreground-muted)]">
            {icon}
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
        {value}
      </p>

      {description ? (
        <p className="mt-1 text-xs text-[var(--foreground-muted)]">
          {description}
        </p>
      ) : null}
    </article>
  );
}
