
import type { ReactNode } from 'react';

import { Card } from '@/components/ui/card';

export type TrustMetricTrendDirection = 'up' | 'down' | 'neutral';

export interface TrustMetricCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    direction: TrustMetricTrendDirection;
    label: string;
  };
  className?: string;
}

const TREND_STYLES: Record<TrustMetricTrendDirection, string> = {
  up: 'text-[var(--success)]',
  down: 'text-[var(--danger)]',
  neutral: 'text-[var(--foreground-muted)]',
};

function TrendIndicator({
  direction,
  label,
}: NonNullable<TrustMetricCardProps['trend']>) {
  const symbol =
    direction === 'up' ? '↑' : direction === 'down' ? '↓' : '→';

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${TREND_STYLES[direction]}`}
    >
      <span aria-hidden="true">{symbol}</span>
      <span>{label}</span>
    </span>
  );
}

export function TrustMetricCard({
  label,
  value,
  description,
  icon,
  trend,
  className,
}: TrustMetricCardProps) {
  return (
    <Card
      variant="default"
      padding="md"
      className={['min-w-0', className].filter(Boolean).join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[var(--foreground-secondary)]">
          {label}
        </p>

        {icon && (
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--background-subtle)] text-[var(--foreground-secondary)]"
          >
            {icon}
          </span>
        )}
      </div>

      <div className="mt-3">
        <p className="break-words text-2xl font-semibold tracking-tight text-[var(--foreground)] tabular-nums">
          {value}
        </p>
      </div>

      {(description || trend) && (
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
          {description && (
            <p className="text-xs text-[var(--foreground-muted)]">
              {description}
            </p>
          )}

          {trend && <TrendIndicator {...trend} />}
        </div>
      )}
    </Card>
  );
}

export default TrustMetricCard;
