
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Payment Method Metric Card
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Display one payment-method overview metric.
 * - Reuse the shared Card primitive.
 * - Support optional supporting text and icon content.
 * - Keep metric calculation in the consuming layer.
 * -----------------------------------------------------------------------------
 */

import type { ReactNode } from 'react';

import { Card } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentMethodMetricCardProps {
  label: string;
  value: number | string;
  description?: string;
  icon?: ReactNode;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentMethodMetricCard({
  label,
  value,
  description,
  icon,
  className,
}: PaymentMethodMetricCardProps) {
  return (
    <Card
      padding="md"
      className={cn('min-w-0 shadow-none', className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <p className="text-sm font-medium text-[var(--foreground-secondary)]">
            {label}
          </p>

          <p className="break-words text-2xl font-semibold tracking-tight text-[var(--foreground)] tabular-nums">
            {value}
          </p>

          {description && (
            <p className="text-xs leading-5 text-[var(--foreground-muted)]">
              {description}
            </p>
          )}
        </div>

        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand-soft)] text-[var(--brand)]">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

export default PaymentMethodMetricCard;
