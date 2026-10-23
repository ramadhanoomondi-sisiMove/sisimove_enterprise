
import type { ReactNode } from 'react';

import { Card } from '@/components/ui';

export type BookingMetricTone =
  | 'default'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';

interface BookingMetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  tone?: BookingMetricTone;
  className?: string;
}

const toneClasses: Record<BookingMetricTone, string> = {
  default: 'text-[var(--foreground)]',
  info: 'text-[var(--brand)]',
  success: 'text-[var(--success)]',
  warning: 'text-[var(--warning)]',
  danger: 'text-[var(--danger)]',
};

export function BookingMetricCard({
  title,
  value,
  description,
  icon,
  tone = 'default',
  className,
}: BookingMetricCardProps) {
  return (
    <Card
      padding="md"
      className={className}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--foreground-secondary)]">
            {title}
          </p>

          <p
            className={`mt-2 break-words text-2xl font-semibold tracking-tight tabular-nums ${toneClasses[tone]}`}
          >
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              {description}
            </p>
          )}
        </div>

        {icon && (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--background-muted)] text-[var(--foreground-secondary)]">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

export type { BookingMetricCardProps };
