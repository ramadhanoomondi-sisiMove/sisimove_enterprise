'use client';

import { useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import { Button } from '@/components/ui/button';

import {
  AssetLoadingState,
  AssetErrorState,
  AssetEmptyState,
} from '@/components/admin/assets/shared';

import {
  AssetFilterChips,
  AssetFilterSummary,
} from '@/components/admin/assets/filters';

import {
  useAssets,
  useAssetFilters,
} from '@/features/admin/assets/hooks';

import type {
  AssetModel,
  AssetFiltersModel,
} from '@/features/admin/assets/models';

import { AssetDirectoryHeader } from './AssetDirectoryHeader';
import { AssetSearch } from './AssetSearch';
import { AssetFilters } from './AssetFilters';
import { AssetViewSwitcher } from './AssetViewSwitcher';
import type { AssetViewMode } from './AssetViewSwitcher';
import { AssetTable } from './AssetTable';
import type { AssetTableSortField } from './AssetTable';
import { AssetGrid } from './AssetGrid';
import { AssetPagination } from './AssetPagination';

const DEFAULT_PAGE_SIZE = 20;

function getAssetName(asset: AssetModel): string {
  return asset.originalFilename?.trim() || asset.publicId;
}

function compareAssets(
  first: AssetModel,
  second: AssetModel,
  field: AssetTableSortField,
): number {
  switch (field) {
    case 'name':
      return getAssetName(first).localeCompare(getAssetName(second));

    case 'category':
      return first.category.localeCompare(second.category);

    case 'status':
      return first.status.localeCompare(second.status);

    case 'visibility':
      return first.visibility.localeCompare(second.visibility);

    case 'size':
      return first.sizeBytes - second.sizeBytes;

    case 'createdAt':
      return first.createdAt.getTime() - second.createdAt.getTime();

    default:
      return 0;
  }
}

export interface AssetDirectoryProps {
  readonly className?: string;
  readonly initialView?: AssetViewMode;
  readonly initialPageSize?: number;
  readonly onOpenAsset?: (asset: AssetModel) => void;
  readonly onMoreActions?: (asset: AssetModel) => void;
}

export function AssetDirectory({
  className,
  initialView = 'table',
  initialPageSize = DEFAULT_PAGE_SIZE,
  onOpenAsset,
  onMoreActions,
}: AssetDirectoryProps) {
  const assetsQuery = useAssets();
  const assets = assetsQuery.assets;

  const {
    filters,
    filteredAssets,
    totalAssets,
    filteredCount,
    hasFilters,
    updateFilter,
    setSearch,
    resetFilters,
  } = useAssetFilters(assets);

  const [view, setView] = useState<AssetViewMode>(initialView);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(
    Math.max(1, initialPageSize),
  );
  const [sortField, setSortField] =
    useState<AssetTableSortField>('createdAt');
  const [sortDirection, setSortDirection] =
    useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = [
    filters.search.trim().length > 0,
    filters.type !== '',
    filters.category !== '',
    filters.status !== '',
    filters.visibility !== '',
    filters.storageProvider !== '',
  ].filter(Boolean).length;

  const sortedAssets = useMemo(() => {
    const direction = sortDirection === 'asc' ? 1 : -1;

    return [...filteredAssets].sort(
      (first, second) =>
        direction * compareAssets(first, second, sortField),
    );
  }, [filteredAssets, sortField, sortDirection]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedAssets.length / pageSize),
  );

  const safePage = Math.min(page, totalPages);

  const pageAssets = useMemo(() => {
    const start = (safePage - 1) * pageSize;

    return sortedAssets.slice(start, start + pageSize);
  }, [sortedAssets, safePage, pageSize]);

  const handleSort = (field: AssetTableSortField) => {
    if (field === sortField) {
      setSortDirection((current) =>
        current === 'asc' ? 'desc' : 'asc',
      );
    } else {
      setSortField(field);
      setSortDirection(field === 'createdAt' ? 'desc' : 'asc');
    }

    setPage(1);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleFilterChange = <K extends keyof AssetFiltersModel>(
    key: K,
    value: AssetFiltersModel[K],
  ) => {
    updateFilter(key, value);
    setPage(1);
  };

  const handleResetFilters = () => {
    resetFilters();
    setPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(Math.max(1, size));
    setPage(1);
  };

  if (assetsQuery.isLoading) {
    return <AssetLoadingState variant="page" />;
  }

  if (assetsQuery.isError) {
    return (
      <AssetErrorState
        variant="load"
        onRetry={() => void assetsQuery.refresh()}
      />
    );
  }

  return (
    <section
      aria-label="Asset directory"
      className={cn('space-y-5', className)}
    >
      <AssetDirectoryHeader
        totalAssets={totalAssets}
        filteredAssets={filteredCount}
        loading={assetsQuery.isFetching}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leadingIcon={<RefreshCw className="size-4" />}
              loading={assetsQuery.isFetching}
              onClick={() => void assetsQuery.refresh()}
            >
              Refresh
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters((current) => !current)}
              aria-expanded={showFilters}
              aria-controls="asset-directory-filters"
            >
              {showFilters ? 'Hide filters' : 'Filters'}

              {hasFilters && (
                <span className="ml-1 rounded-full bg-[var(--brand-soft)] px-1.5 py-0.5 text-xs text-[var(--brand)]">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            <AssetViewSwitcher
              value={view}
              onChange={setView}
              disabled={assetsQuery.isFetching}
            />
          </div>
        }
      />

      <AssetFilterSummary
        totalAssets={totalAssets}
        filteredAssets={filteredCount}
        activeFilterCount={activeFilterCount}
        isFiltered={hasFilters}
        isLoading={assetsQuery.isFetching}
      />

      <AssetFilterChips
        search={filters.search}
        type={filters.type}
        category={filters.category}
        status={filters.status}
        visibility={filters.visibility}
        storageProvider={filters.storageProvider}
        onSearchChange={handleSearch}
        onTypeChange={(value) => handleFilterChange('type', value)}
        onCategoryChange={(value) =>
          handleFilterChange('category', value)
        }
        onStatusChange={(value) =>
          handleFilterChange('status', value)
        }
        onVisibilityChange={(value) =>
          handleFilterChange('visibility', value)
        }
        onStorageProviderChange={(value) =>
          handleFilterChange('storageProvider', value)
        }
        onClearAll={handleResetFilters}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <AssetSearch
            value={filters.search}
            onChange={handleSearch}
            disabled={assetsQuery.isFetching}
          />
        </div>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
          >
            Clear filters
          </Button>
        )}
      </div>

      {showFilters && (
        <div id="asset-directory-filters">
          <AssetFilters
            value={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
            disabled={assetsQuery.isFetching}
          />
        </div>
      )}

      {filteredCount === 0 ? (
        <AssetEmptyState
          variant={hasFilters ? 'no-results' : 'empty'}
          onClearFilters={hasFilters ? handleResetFilters : undefined}
        />
      ) : (
        <>
          {view === 'table' ? (
            <AssetTable
              assets={pageAssets}
              loading={assetsQuery.isFetching}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              onOpenAsset={onOpenAsset}
              onMoreActions={onMoreActions}
            />
          ) : (
            <AssetGrid
              assets={pageAssets}
              loading={assetsQuery.isFetching}
              onOpenAsset={onOpenAsset}
              onMoreActions={onMoreActions}
            />
          )}

          <AssetPagination
            page={safePage}
            pageSize={pageSize}
            totalItems={sortedAssets.length}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}
    </section>
  );
}

export default AssetDirectory;
