
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Asset Lifecycle Summary
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Summarize asset counts by lifecycle status.
 * - Use backend AssetStatus values as the source of truth.
 * - Reuse shared Card, Badge, and AssetStatusBadge components.
 * - Support loading and empty states.
 *
 * This component does not fetch data or calculate lifecycle transitions.
 * -----------------------------------------------------------------------------
 */

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import { AssetStatus } from '@/features/admin/assets/models';

import { AssetStatusBadge } from '../shared';

import { cn } from '@/foundation/utils/cn';

// =============================================================================
// Types
// =============================================================================

export interface AssetLifecycleCount {
  readonly status: AssetStatus;
  readonly count: number;
}

export interface AssetLifecycleSummaryProps {
  readonly items: readonly AssetLifecycleCount[];
  readonly loading?: boolean;
  readonly className?: string;
}

// =============================================================================
// Lifecycle Order
// =============================================================================

const LIFECYCLE_ORDER: readonly AssetStatus[] = [
  AssetStatus.UPLOADING,
  AssetStatus.UPLOADED,
  AssetStatus.READY,
  AssetStatus.ARCHIVED,
  AssetStatus.DELETED,
];

// =============================================================================
// Component
// =============================================================================

export function AssetLifecycleSummary({
  items,
  loading = false,
  className,
}: AssetLifecycleSummaryProps) {
  const countByStatus = new Map(
    items.map(({ status, count }) => [status, count]),
  );

  const totalAssets = items.reduce(
    (total, item) => total + item.count,
    0,
  );

  return (
    <Card
      className={cn(
        'min-w-0 border border-[var(--border)]',
        className,
      )}
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Asset lifecycle
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Distribution by current lifecycle status
          </p>
        </div>

        {loading ? (
          <Skeleton className="h-6 w-24" />
        ) : (
          <Badge variant="default">
            {totalAssets.toLocaleString()} assets
          </Badge>
        )}
      </div>

      <div className="mt-5 space-y-4">
        {LIFECYCLE_ORDER.map((status) => {
          const count = countByStatus.get(status) ?? 0;
          const percentage =
            totalAssets > 0 ? (count / totalAssets) * 100 : 0;

          return (
            <div key={status} className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <AssetStatusBadge status={status} />

                {loading ? (
                  <Skeleton className="h-4 w-12" />
                ) : (
                  <span className="text-sm font-medium tabular-nums text-[var(--foreground)]">
                    {count.toLocaleString()}
                    <span className="ml-2 text-xs font-normal text-[var(--foreground-muted)]">
                      {percentage.toFixed(1)}%
                    </span>
                  </span>
                )}
              </div>

              <div
                className="h-2 overflow-hidden rounded-full bg-[var(--background-muted)]"
                role="progressbar"
                aria-label={`${status} assets`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={loading ? 0 : percentage}
              >
                {!loading && (
                  <div
                    className={cn(
                      'h-full rounded-full transition-[width] duration-300',
                      status === AssetStatus.READY && 'bg-[var(--success)]',
                      status === AssetStatus.UPLOADING && 'bg-[var(--warning)]',
                      status === AssetStatus.UPLOADED && 'bg-[var(--brand)]',
                      status === AssetStatus.ARCHIVED && 'bg-[var(--border-strong)]',
                      status === AssetStatus.DELETED && 'bg-[var(--danger)]',
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!loading && totalAssets === 0 && (
        <p className="mt-4 text-sm text-[var(--foreground-muted)]">
          No lifecycle records are available yet.
        </p>
      )}
    </Card>
  );
}

export default AssetLifecycleSummary;
