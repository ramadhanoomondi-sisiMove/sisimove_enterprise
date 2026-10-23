
/**
 * sisiMove — Admin Boarding Directory
 *
 * Path:
 * src/features/admin/boardings/directory/BoardingDirectory.tsx
 *
 * Responsibilities:
 * - Fetch boarding records through the React Query hook.
 * - Manage filters, sorting, and client-side pagination.
 * - Display loading, error, and empty states.
 * - Delegate row viewing to the parent.
 */

'use client';

import { useCallback, useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

import { useAdminBoardings } from '@/features/admin/boardings';
import type { AdminBoarding } from'@/features/admin/boardings';
import type {
  AdminBoardingFilters,
  AdminBoardingPagination,
} from '@/features/admin/boardings';

import { BoardingDirectoryHeader } from './BoardingDirectoryHeader';
import { BoardingFilters } from './BoardingFilters';
import { BoardingFilterSummary } from '../filters/BoardingFilterSummary';
import { BoardingTable } from './BoardingTable';
import { BoardingPagination } from './BoardingPagination';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface BoardingDirectoryProps {
  onViewBoarding?: (boarding: AdminBoarding) => void;
  className?: string;
}

// -----------------------------------------------------------------------------
// Default Filters
// -----------------------------------------------------------------------------

const DEFAULT_FILTERS: AdminBoardingFilters = {
  search: '',
  status: 'ALL',
  providerPublicId: '',
  journeyId: '',
  startedFrom: '',
  startedTo: '',
  createdFrom: '',
  createdTo: '',
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function matchesDateRange(
  value: string | null | undefined,
  from?: string,
  to?: string,
): boolean {
  if (!from && !to) return true;
  if (!value) return false;

  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) return false;

  if (from) {
    const fromTimestamp = new Date(`${from}T00:00:00`).getTime();
    if (timestamp < fromTimestamp) return false;
  }

  if (to) {
    const toTimestamp = new Date(`${to}T23:59:59.999`).getTime();
    if (timestamp > toTimestamp) return false;
  }

  return true;
}

function getSortValue(
  boarding: AdminBoarding,
  field: NonNullable<AdminBoardingFilters['sortBy']>,
): string | number {
  switch (field) {
    case 'status':
      return boarding.status;

    case 'boardingStartedAt':
      return boarding.boardingStartedAt
        ? new Date(boarding.boardingStartedAt).getTime()
        : 0;

    case 'journeyStartedAt':
      return boarding.journeyStartedAt
        ? new Date(boarding.journeyStartedAt).getTime()
        : 0;

    case 'cancelledAt':
      return boarding.cancelledAt
        ? new Date(boarding.cancelledAt).getTime()
        : 0;

    case 'updatedAt':
      return new Date(boarding.updatedAt).getTime();

    case 'createdAt':
    default:
      return new Date(boarding.createdAt).getTime();
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function BoardingDirectory({
  onViewBoarding,
  className,
}: BoardingDirectoryProps) {
  const [filters, setFilters] =
    useState<AdminBoardingFilters>(DEFAULT_FILTERS);

  const boardingsQuery = useAdminBoardings();

  // The API adapter normalizes the collection into AdminBoarding[].
const boardings = useMemo<AdminBoarding[]>(
  () => boardingsQuery.data ?? [],
  [boardingsQuery.data],
);
  // ---------------------------------------------------------------------------
  // Filtering
  // ---------------------------------------------------------------------------

  const filteredBoardings = useMemo(() => {
    const search = filters.search?.trim().toLowerCase() ?? '';

    return boardings.filter((boarding) => {
      if (
        filters.status &&
        filters.status !== 'ALL' &&
        boarding.status !== filters.status
      ) {
        return false;
      }

      if (
        filters.providerPublicId &&
        !boarding.providerPublicId
          .toLowerCase()
          .includes(filters.providerPublicId.toLowerCase())
      ) {
        return false;
      }

      if (
        filters.journeyId &&
        !boarding.journeyId
          .toLowerCase()
          .includes(filters.journeyId.toLowerCase())
      ) {
        return false;
      }

      if (
        !matchesDateRange(
          boarding.boardingStartedAt,
          filters.startedFrom,
          filters.startedTo,
        )
      ) {
        return false;
      }

      if (
        !matchesDateRange(
          boarding.createdAt,
          filters.createdFrom,
          filters.createdTo,
        )
      ) {
        return false;
      }

      if (search) {
        const searchableValues = [
          boarding.publicId,
          boarding.journeyId,
          boarding.providerPublicId,
          boarding.status,
          ...boarding.participants.map(
            (participant) =>
              `${participant.memberPublicId} ${participant.bookingPublicId ?? ''}`,
          ),
        ];

        if (
          !searchableValues.some((value) =>
            value.toLowerCase().includes(search),
          )
        ) {
          return false;
        }
      }

      return true;
    });
  }, [boardings, filters]);

  // ---------------------------------------------------------------------------
  // Sorting
  // ---------------------------------------------------------------------------

  const sortedBoardings = useMemo(() => {
    const field = filters.sortBy ?? 'createdAt';
    const direction = filters.sortOrder === 'asc' ? 1 : -1;

    return [...filteredBoardings].sort((a, b) => {
      const left = getSortValue(a, field);
      const right = getSortValue(b, field);

      if (left < right) return -1 * direction;
      if (left > right) return 1 * direction;

      return 0;
    });
  }, [filteredBoardings, filters.sortBy, filters.sortOrder]);

  // ---------------------------------------------------------------------------
  // Pagination
  // ---------------------------------------------------------------------------

  const pageSize = Math.max(1, filters.limit ?? 10);
  const requestedPage = Math.max(1, filters.page ?? 1);
  const totalItems = sortedBoardings.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const currentPage = Math.min(
    requestedPage,
    Math.max(1, totalPages),
  );

  const visibleBoardings = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;

    return sortedBoardings.slice(startIndex, startIndex + pageSize);
  }, [sortedBoardings, currentPage, pageSize]);

  const pagination: AdminBoardingPagination = {
    page: currentPage,
    limit: pageSize,
    total: totalItems,
    totalPages,
  };

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleFiltersChange = useCallback(
    (nextFilters: AdminBoardingFilters) => {
      setFilters({
        ...nextFilters,
        page: 1,
      });
    },
    [],
  );

  const handlePageChange = useCallback((page: number) => {
    setFilters((current) => ({
      ...current,
      page: Math.max(1, page),
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({
      ...DEFAULT_FILTERS,
      limit: filters.limit ?? DEFAULT_FILTERS.limit,
    });
  }, [filters.limit]);

 const handleRefresh = useCallback(async (): Promise<void> => {
  await boardingsQuery.refetch();
}, [boardingsQuery]);

  // ---------------------------------------------------------------------------
  // Query State
  // ---------------------------------------------------------------------------

  const isInitialLoading =
    boardingsQuery.isLoading && !boardingsQuery.data;

  const isRefreshing =
    boardingsQuery.isFetching && !boardingsQuery.isLoading;

  const errorMessage = boardingsQuery.error
    ? boardingsQuery.error instanceof Error
      ? boardingsQuery.error.message
      : 'An unexpected error occurred while fetching boarding records.'
    : null;

  const lastUpdatedAt = boardingsQuery.dataUpdatedAt
    ? new Date(boardingsQuery.dataUpdatedAt).toISOString()
    : null;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className={cn('space-y-6', className)}>
      <BoardingDirectoryHeader
        totalBoardings={boardings.length}
        lastUpdatedAt={lastUpdatedAt}
        isLoading={isInitialLoading}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      />

      <BoardingFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
        disabled={isInitialLoading}
      />

      <BoardingFilterSummary
        filters={filters}
        totalResults={totalItems}
      />

      {errorMessage ? (
        <section
          role="alert"
          aria-labelledby="boarding-directory-error-title"
          className={cn(
            'rounded-[var(--radius-lg)] border',
            'border-[var(--danger)]/30',
            'bg-[var(--danger-soft)] p-5',
          )}
        >
          <h2
            id="boarding-directory-error-title"
            className="text-sm font-semibold text-[var(--foreground)]"
          >
            Unable to load boarding records
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            {errorMessage}
          </p>

          <button
            type="button"
            onClick={() => void handleRefresh()}
            disabled={boardingsQuery.isFetching}
            className={cn(
              'mt-4 inline-flex min-h-9 items-center gap-2',
              'rounded-[var(--radius-md)] border',
              'border-[var(--border)] bg-[var(--surface)] px-3',
              'text-sm font-medium text-[var(--foreground)]',
              'hover:bg-[var(--background-muted)]',
              'focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-[var(--brand)]/30',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
          >
            <RefreshCw
              aria-hidden="true"
              className={cn(
                'h-4 w-4',
                boardingsQuery.isFetching && 'animate-spin',
              )}
            />
            Retry
          </button>
        </section>
      ) : isInitialLoading ? (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            'flex min-h-48 items-center justify-center gap-3',
            'rounded-[var(--radius-lg)] border',
            'border-[var(--border)] bg-[var(--surface)] p-6',
            'text-sm text-[var(--foreground-secondary)]',
          )}
        >
          <RefreshCw
            aria-hidden="true"
            className="h-4 w-4 animate-spin"
          />
          Loading boarding records…
        </div>
      ) : (
        <>
          <BoardingTable
            boardings={visibleBoardings}
            onView={onViewBoarding}
            emptyTitle="No boarding records found"
            emptyDescription="Try changing your search criteria or clearing the active filters."
          />

          {totalPages > 1 && (
            <BoardingPagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              pageSize={pagination.limit}
              onPageChange={handlePageChange}
              disabled={boardingsQuery.isFetching}
            />
          )}
        </>
      )}
    </div>
  );
}
