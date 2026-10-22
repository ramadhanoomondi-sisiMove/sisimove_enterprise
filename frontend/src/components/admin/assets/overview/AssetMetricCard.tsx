
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Asset Metric Card
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Display one asset metric with consistent visual hierarchy.
 * - Reuse shared UI primitives instead of duplicating their styling.
 * - Support loading, contextual indicators, and semantic variants.
 * - Remain independent of API and feature-hook logic.
 *
 * -----------------------------------------------------------------------------
 */

import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { cn } from '@/foundation/utils/cn';

// =============================================================================
// Types
// =============================================================================

export type AssetMetricVariant =
  | 'default'
  | 'brand'
  | 'success'
  | 'warning'
  | 'danger';

export interface AssetMetricCardProps {
  readonly title: string;
  readonly value: ReactNode;
  readonly description?: string;
  readonly icon?: ReactNode;
  readonly variant?: AssetMetricVariant;
  readonly indicator?: ReactNode;
  readonly loading?: boolean;
  readonly className?: string;
}

// =============================================================================
// Styles
// =============================================================================

const ICON_VARIANT_CLASSES: Record<AssetMetricVariant, string> = {
  default:
    'bg-[var(--background-muted)] text-[var(--foreground-secondary)]',
  brand:
    'bg-[var(--brand-soft)] text-[var(--brand)]',
  success:
    'bg-[var(--success-soft)] text-[var(--success)]',
  warning:
    'bg-[var(--warning-soft)] text-[var(--warning)]',
  danger:
    'bg-[var(--danger-soft)] text-[var(--danger)]',
};

const INDICATOR_VARIANT: Partial<
  Record<AssetMetricVariant, 'default' | 'brand' | 'success' | 'warning' | 'danger'>
> = {
  default: 'default',
  brand: 'brand',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
};

// =============================================================================
// Component
// =============================================================================

export function AssetMetricCard({
  title,
  value,
  description,
  icon,
  variant = 'default',
  indicator,
  loading = false,
  className,
}: AssetMetricCardProps) {
  return (
    <Card
      className={cn(
        'min-w-0 border border-[var(--border)] shadow-[var(--shadow-sm)]',
        className,
      )}
    >
      <div
        aria-busy={loading}
        className="flex items-start justify-between gap-3"
      >
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-[var(--foreground-secondary)]">
            {title}
          </h3>

          {loading ? (
            <Skeleton className="mt-3 h-8 w-28" />
          ) : (
            <div className="mt-2 break-words text-2xl font-semibold tracking-tight text-[var(--foreground)] tabular-nums sm:text-3xl">
              {value}
            </div>
          )}
        </div>

        {icon && (
          <div
            aria-hidden="true"
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-lg)]',
              ICON_VARIANT_CLASSES[variant],
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {(description || indicator) && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          {loading ? (
            <Skeleton className="h-4 w-36" />
          ) : (
            <>
              {description && (
                <p className="min-w-0 text-xs leading-5 text-[var(--foreground-muted)]">
                  {description}
                </p>
              )}

              {indicator && (
                <div className="shrink-0">
                  {typeof indicator === 'string' ? (
                    <Badge variant={INDICATOR_VARIANT[variant] ?? 'default'} size="sm">
                      {indicator}
                    </Badge>
                  ) : (
                    indicator
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </Card>
  );
}

export default AssetMetricCard;
