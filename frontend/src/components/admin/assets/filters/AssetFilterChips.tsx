'use client';

import {
  AssetCategory,
  AssetStatus,
  AssetStorageProvider,
  AssetType,
  AssetVisibility,
} from '@/features/admin/assets/models/asset.enums';
import { cn } from '@/foundation/utils/cn';
import { X } from 'lucide-react';

export interface AssetFilterChipsProps {
  search: string;
  type: AssetType | '';
  category: AssetCategory | '';
  status: AssetStatus | '';
  visibility: AssetVisibility | '';
  storageProvider: AssetStorageProvider | '';
  onSearchChange: (value: string) => void;
  onTypeChange: (value: AssetType | '') => void;
  onCategoryChange: (value: AssetCategory | '') => void;
  onStatusChange: (value: AssetStatus | '') => void;
  onVisibilityChange: (value: AssetVisibility | '') => void;
  onStorageProviderChange: (value: AssetStorageProvider | '') => void;
  onClearAll?: () => void;
  className?: string;
}

function formatLabel(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

interface FilterChip {
  key: string;
  label: string;
  value: string;
  onRemove: () => void;
}

export function AssetFilterChips({
  search,
  type,
  category,
  status,
  visibility,
  storageProvider,
  onSearchChange,
  onTypeChange,
  onCategoryChange,
  onStatusChange,
  onVisibilityChange,
  onStorageProviderChange,
  onClearAll,
  className,
}: AssetFilterChipsProps) {
  const chips: FilterChip[] = [];

  if (search.trim()) {
    chips.push({
      key: 'search',
      label: 'Search',
      value: search.trim(),
      onRemove: () => onSearchChange(''),
    });
  }

  if (type) {
    chips.push({
      key: 'type',
      label: 'Type',
      value: formatLabel(type),
      onRemove: () => onTypeChange(''),
    });
  }

  if (category) {
    chips.push({
      key: 'category',
      label: 'Category',
      value: formatLabel(category),
      onRemove: () => onCategoryChange(''),
    });
  }

  if (status) {
    chips.push({
      key: 'status',
      label: 'Status',
      value: formatLabel(status),
      onRemove: () => onStatusChange(''),
    });
  }

  if (visibility) {
    chips.push({
      key: 'visibility',
      label: 'Visibility',
      value: formatLabel(visibility),
      onRemove: () => onVisibilityChange(''),
    });
  }

  if (storageProvider) {
    chips.push({
      key: 'storageProvider',
      label: 'Storage',
      value: formatLabel(storageProvider),
      onRemove: () => onStorageProviderChange(''),
    });
  }

  if (chips.length === 0) {
    return null;
  }

  return (
    <div
      className={cn('flex flex-wrap items-center gap-2', className)}
      aria-label="Active asset filters"
    >
      <span className="mr-1 text-xs font-medium text-[var(--muted-foreground)]">
        Active filters
      </span>

      {chips.map((chip) => (
        <span
          key={chip.key}
          className={cn(
            'inline-flex max-w-full items-center gap-1.5 rounded-full',
            'border border-[var(--border)] bg-[var(--background-muted)]',
            'py-1 pl-3 pr-1 text-xs text-[var(--foreground)]',
          )}
        >
          <span className="text-[var(--muted-foreground)]">
            {chip.label}:
          </span>

          <span
            className="max-w-48 truncate font-medium"
            title={chip.value}
          >
            {chip.value}
          </span>

          <button
            type="button"
            onClick={chip.onRemove}
            aria-label={`Remove ${chip.label.toLowerCase()} filter`}
            className={cn(
              'inline-flex h-5 w-5 shrink-0 items-center justify-center',
              'rounded-full transition-colors',
              'hover:bg-[var(--border)]',
              'focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-[var(--brand)]',
            )}
          >
            <X aria-hidden="true" className="h-3 w-3" />
          </button>
        </span>
      ))}

      {onClearAll ? (
        <button
          type="button"
          onClick={onClearAll}
          className={cn(
            'rounded px-2 py-1 text-xs font-semibold text-[var(--brand)]',
            'hover:underline focus-visible:outline-none',
            'focus-visible:ring-2 focus-visible:ring-[var(--brand)]',
          )}
        >
          Clear all
        </button>
      ) : null}
    </div>
  );
}

export default AssetFilterChips;
