// src/components/admin/commissions/overview/CommissionMetricCard.tsx

import type { ReactNode } from 'react';

import { Card } from '@/components/ui';

export interface CommissionMetricCardProps {
  readonly title: string;
  readonly value: ReactNode;
  readonly description?: string;
  readonly icon?: ReactNode;
  readonly footer?: ReactNode;
  readonly className?: string;
}

export function CommissionMetricCard({
  title,
  value,
  description,
  icon,
  footer,
  className,
}: CommissionMetricCardProps) {
  return (
    <Card
      padding="md"
      className={['min-w-0', className].filter(Boolean).join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[var(--foreground-muted)]">
          {title}
        </p>

        {icon && (
          <span
            aria-hidden="true"
            className="inline-flex shrink-0 items-center justify-center text-[var(--foreground-muted)]"
          >
            {icon}
          </span>
        )}
      </div>

      <div className="mt-3 min-w-0">
        <p className="break-words text-2xl font-semibold tracking-tight text-[var(--foreground)] tabular-nums">
          {value}
        </p>

        {description && (
          <p className="mt-1 text-sm leading-5 text-[var(--foreground-muted)]">
            {description}
          </p>
        )}
      </div>

      {footer && (
        <div className="mt-4 border-t border-[var(--border-subtle)] pt-3">
          {footer}
        </div>
      )}
    </Card>
  );
}