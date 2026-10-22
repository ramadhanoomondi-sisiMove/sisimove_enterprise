
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Asset Category Breakdown
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Display asset counts grouped by category.
 * - Show each category's share of the supplied total.
 * - Reuse shared Card, Badge, and AssetCategoryBadge components.
 * - Support loading and empty states.
 *
 * This component does not fetch assets or calculate category membership.
 * -----------------------------------------------------------------------------
 */

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import { AssetCategory } from '@/features/admin/assets/models';
import { AssetCategoryBadge } from '../shared';

import { cn } from '@/foundation/utils/cn';

// =============================================================================
// Types
// =============================================================================

export interface AssetCategoryCount {
  readonly category: AssetCategory;
  readonly count: number;
}

export interface AssetCategoryBreakdownProps {
  readonly items: readonly AssetCategoryCount[];
  readonly loading?: boolean;
  readonly className?: string;
}

// =============================================================================
// Category Order
// =============================================================================

const CATEGORY_ORDER: readonly AssetCategory[] = [
  AssetCategory.PROFILE_PHOTO,
  AssetCategory.COVER_PHOTO,
  AssetCategory.AVATAR,
  AssetCategory.GOVERNMENT_ID,
  AssetCategory.DRIVER_LICENSE,
  AssetCategory.PASSPORT,
  AssetCategory.SELFIE,
  AssetCategory.VEHICLE_PHOTO,
  AssetCategory.CHAT_ATTACHMENT,
  AssetCategory.OTHER,
];

// =============================================================================
// Component
// =============================================================================

export function AssetCategoryBreakdown({
  items,
  loading = false,
  className,
}: AssetCategoryBreakdownProps) {
  const countByCategory = new Map(
    items.map(({ category, count }) => [category, count]),
  );

  const totalAssets = items.reduce(
    (total, item) => total + item.count,
    0,
  );

  const orderedCategories = CATEGORY_ORDER
    .map((category) => ({
      category,
      count: countByCategory.get(category) ?? 0,
    }))
    .filter(({ count }) => count > 0 || loading);

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
            Category breakdown
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Distribution across asset categories
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
        {loading && orderedCategories.length === 0
          ? CATEGORY_ORDER.slice(0, 5).map((category) => (
              <div key={category} className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))
          : orderedCategories.map(({ category, count }) => {
              const percentage =
                totalAssets > 0 ? (count / totalAssets) * 100 : 0;

              return (
                <div key={category} className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <AssetCategoryBadge category={category} />

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
                    aria-label={`${category} assets`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={loading ? 0 : percentage}
                  >
                    {!loading && (
                      <div
                        className={cn(
                          'h-full rounded-full bg-[var(--brand)] transition-[width] duration-300',
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
          No category records are available yet.
        </p>
      )}
    </Card>
  );
}

export default AssetCategoryBreakdown;
