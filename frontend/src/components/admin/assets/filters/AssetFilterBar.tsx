
'use client';

import {
  AssetCategory,
  AssetStatus,
  AssetType,
  AssetVisibility,
} from '@/features/admin/assets/models/asset.enums';
import { cn } from '@/foundation/utils/cn';

export interface AssetFilterBarProps {
  search: string;
  type: AssetType | '';
  category: AssetCategory | '';
  status: AssetStatus | '';
  visibility: AssetVisibility | '';
  onSearchChange: (value: string) => void;
  onTypeChange: (value: AssetType | '') => void;
  onCategoryChange: (value: AssetCategory | '') => void;
  onStatusChange: (value: AssetStatus | '') => void;
  onVisibilityChange: (value: AssetVisibility | '') => void;
  onClearFilters?: () => void;
  className?: string;
}

const TYPE_OPTIONS = Object.values(AssetType);
const CATEGORY_OPTIONS = Object.values(AssetCategory);
const STATUS_OPTIONS = Object.values(AssetStatus);
const VISIBILITY_OPTIONS = Object.values(AssetVisibility);

function formatLabel(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const selectClassName = cn(
  'h-10 w-full min-w-0 rounded-lg border border-[var(--border)]',
  'bg-[var(--background)] px-3 text-sm text-[var(--foreground)]',
  'outline-none transition-colors',
  'focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20',
);

const labelClassName =
  'mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]';

export function AssetFilterBar({
  search,
  type,
  category,
  status,
  visibility,
  onSearchChange,
  onTypeChange,
  onCategoryChange,
  onStatusChange,
  onVisibilityChange,
  onClearFilters,
  className,
}: AssetFilterBarProps) {
  const hasActiveFilters =
    search.trim().length > 0 ||
    type !== '' ||
    category !== '' ||
    status !== '' ||
    visibility !== '';

  return (
    <section
      aria-label="Asset filters"
      className={cn(
        'rounded-xl border border-[var(--border)]',
        'bg-[var(--background)] p-4',
        className,
      )}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[var(--foreground)]">
            Filter assets
          </h2>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            Narrow the list by filename, type, category, status, or visibility.
          </p>
        </div>

        {onClearFilters && hasActiveFilters ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="rounded-md px-2 py-1 text-sm font-medium text-[var(--brand)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="sm:col-span-2 xl:col-span-1">
          <label className={labelClassName} htmlFor="asset-filter-search">
            Search
          </label>
          <input
            id="asset-filter-search"
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search filename or ID..."
            className={cn(
              selectClassName,
              'placeholder:text-[var(--muted-foreground)]',
            )}
          />
        </div>

        <div>
          <label className={labelClassName} htmlFor="asset-filter-type">
            Asset type
          </label>
          <select
            id="asset-filter-type"
            value={type}
            onChange={(event) =>
              onTypeChange(event.target.value as AssetType | '')
            }
            className={selectClassName}
          >
            <option value="">All types</option>
            {TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {formatLabel(option)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClassName} htmlFor="asset-filter-category">
            Category
          </label>
          <select
            id="asset-filter-category"
            value={category}
            onChange={(event) =>
              onCategoryChange(event.target.value as AssetCategory | '')
            }
            className={selectClassName}
          >
            <option value="">All categories</option>
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {formatLabel(option)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClassName} htmlFor="asset-filter-status">
            Status
          </label>
          <select
            id="asset-filter-status"
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as AssetStatus | '')
            }
            className={selectClassName}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {formatLabel(option)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className={labelClassName}
            htmlFor="asset-filter-visibility"
          >
            Visibility
          </label>
          <select
            id="asset-filter-visibility"
            value={visibility}
            onChange={(event) =>
              onVisibilityChange(
                event.target.value as AssetVisibility | '',
              )
            }
            className={selectClassName}
          >
            <option value="">All visibility</option>
            {VISIBILITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {formatLabel(option)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}

export default AssetFilterBar;
