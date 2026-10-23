
import type { ReactNode } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import type { JourneyMetricComparison } from '@/features/admin/journeys/models/journey-metrics.model';

export interface JourneyMetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  comparison?: JourneyMetricComparison | null;
  comparisonLabel?: string;
  valueClassName?: string;
  className?: string;
}

function formatPercentage(value: number): string {
  return `${Math.abs(value).toLocaleString(undefined, {
    maximumFractionDigits: 1,
  })}%`;
}

function MetricComparison({
  comparison,
  label,
}: {
  comparison: JourneyMetricComparison;
  label: string;
}) {
  const hasChange =
    comparison.changePercentage !== null &&
    Number.isFinite(comparison.changePercentage);

  const trend = comparison.trend;
  const isPositive = trend === 'up';
  const isNegative = trend === 'down';

  const TrendIcon = isPositive
    ? ArrowUpRight
    : isNegative
      ? ArrowDownRight
      : ArrowRight;

  const toneClass = isPositive
    ? 'text-[var(--success)]'
    : isNegative
      ? 'text-[var(--danger)]'
      : 'text-[var(--foreground-muted)]';

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {hasChange && (
        <span
          className={cn(
            'inline-flex items-center gap-0.5 text-xs font-semibold tabular-nums',
            toneClass,
          )}
          aria-label={`Change of ${formatPercentage(comparison.changePercentage!)} ${label}`}
        >
          <TrendIcon aria-hidden="true" className="size-3.5" />
          {formatPercentage(comparison.changePercentage!)}
        </span>
      )}

      <span className="text-xs text-[var(--foreground-muted)]">
        {label}
      </span>
    </div>
  );
}

export function JourneyMetricCard({
  title,
  value,
  description,
  icon,
  comparison,
  comparisonLabel = 'versus previous period',
  valueClassName,
  className,
}: JourneyMetricCardProps) {
  return (
    <article
      className={cn(
        'group relative min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] transition-all duration-200 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)]',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium leading-5 text-[var(--foreground-secondary)]">
          {title}
        </p>

        {icon && (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background-subtle)] text-[var(--brand)] transition-colors group-hover:bg-[var(--brand-soft)]">
            {icon}
          </div>
        )}
      </div>

      <div
        className={cn(
          'mt-5 break-words text-3xl font-semibold tracking-tight text-[var(--foreground)] tabular-nums sm:text-4xl',
          valueClassName,
        )}
      >
        {value}
      </div>

      {description && (
        <p className="mt-2 text-sm leading-5 text-[var(--foreground-muted)]">
          {description}
        </p>
      )}

      {comparison && (
        <MetricComparison
          comparison={comparison}
          label={comparisonLabel}
        />
      )}
    </article>
  );
}

export default JourneyMetricCard;
