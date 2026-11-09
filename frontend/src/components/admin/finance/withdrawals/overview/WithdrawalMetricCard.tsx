/**
 * SisiMove Admin — Withdrawal Metric Card
 *
 * Reusable presentation component for a single withdrawal metric.
 */

import type { ReactNode } from 'react';

import { Card } from '@/components/ui';

export interface WithdrawalMetricCardProps {
  label: string;
  value: ReactNode;
  description?: string;
  icon?: ReactNode;
  className?: string;
}

export function WithdrawalMetricCard({
  label,
  value,
  description,
  icon,
  className,
}: WithdrawalMetricCardProps) {
  return (
    <Card className={className}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--foreground-muted)]">
            {label}
          </p>

          <div className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            {value}
          </div>

          {description && (
            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              {description}
            </p>
          )}
        </div>

        {icon && (
          <div
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--background-muted)] text-[var(--foreground-secondary)]"
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}