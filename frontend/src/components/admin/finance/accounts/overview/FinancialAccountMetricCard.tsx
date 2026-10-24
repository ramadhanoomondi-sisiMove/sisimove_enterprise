// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Account Metric Card
// -----------------------------------------------------------------------------
//
// Small reusable metric surface for the finance control center.
// The component is presentation-only and does not fetch or aggregate data.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';
import { Card } from '@/components/ui';

export interface FinancialAccountMetricCardProps {
  label: string;
  value: string;
  description?: string;
  icon?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function FinancialAccountMetricCard({
  label,
  value,
  description,
  icon,
  footer,
  className,
}: FinancialAccountMetricCardProps) {
  return (
    <Card
      padding="md"
      className={className}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[var(--foreground-secondary)]">
          {label}
        </p>

        {icon ? (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--background-muted)] text-[var(--foreground-secondary)]">
            {icon}
          </span>
        ) : null}
      </div>

      <p className="mt-4 break-words text-2xl font-semibold tracking-tight text-[var(--foreground)]">
        {value}
      </p>

      {description ? (
        <p className="mt-2 text-xs leading-5 text-[var(--foreground-muted)]">
          {description}
        </p>
      ) : null}

      {footer ? (
        <div className="mt-4 border-t border-[var(--border-subtle)] pt-3">
          {footer}
        </div>
      ) : null}
    </Card>
  );
}

export default FinancialAccountMetricCard;
