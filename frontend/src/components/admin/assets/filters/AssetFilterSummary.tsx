
'use client';

import { FileSearch, Filter, Layers3 } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

export interface AssetFilterSummaryProps {
  totalAssets: number;
  filteredAssets: number;
  activeFilterCount: number;
  isFiltered?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function AssetFilterSummary({
  totalAssets,
  filteredAssets,
  activeFilterCount,
  isFiltered = false,
  isLoading = false,
  className,
}: AssetFilterSummaryProps) {
  const safeTotal = Math.max(0, totalAssets);
  const safeFiltered = Math.max(0, filteredAssets);
  const safeFilterCount = Math.max(0, activeFilterCount);

  const resultLabel = isFiltered
    ? `${safeFiltered.toLocaleString()} of ${safeTotal.toLocaleString()} assets`
    : `${safeTotal.toLocaleString()} assets`;

  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
      aria-live="polite"
      aria-busy={isLoading}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--background-muted)] text-[var(--brand)]">
          {isFiltered ? (
            <FileSearch aria-hidden="true" className="h-5 w-5" />
          ) : (
            <Layers3 aria-hidden="true" className="h-5 w-5" />
          )}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--foreground)]">
            {isLoading ? 'Updating asset results…' : resultLabel}
          </p>

          <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
            {isLoading
              ? 'Refreshing the current view'
              : isFiltered
                ? 'Matching your current filters'
                : 'Showing all assets in the current dataset'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start rounded-lg border border-[var(--border)] px-3 py-2 sm:self-auto">
        <Filter
          aria-hidden="true"
          className="h-4 w-4 text-[var(--muted-foreground)]"
        />

        <span className="text-sm text-[var(--muted-foreground)]">
          Active filters
        </span>

        <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[var(--background-muted)] px-2 py-0.5 text-xs font-semibold text-[var(--foreground)]">
          {safeFilterCount}
        </span>
      </div>
    </div>
  );
}

export default AssetFilterSummary;
