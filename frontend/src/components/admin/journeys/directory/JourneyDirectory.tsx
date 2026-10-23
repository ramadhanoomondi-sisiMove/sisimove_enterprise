
'use client';

/**
 * sisiMove — Journey Directory
 *
 * Composes the existing journey directory components.
 *
 * Responsibilities:
 * - Fetch detailed journeys across all providers.
 * - Own search, filter, and pagination state.
 * - Filter and paginate journeys locally.
 * - Coordinate loading, error, empty, and retry states.
 *
 * Backend authorization and journey lifecycle rules remain server-owned.
 */

import { useMemo, useState } from 'react';

import { cn } from '@/foundation/utils/cn';

import { useAllDetailedJourneys } from '@/features/admin/journeys/hooks/useJourneys';

import type { MappedJourney } from '@/features/admin/journeys/mappers/journey.mapper';

import {
  DEFAULT_JOURNEY_FILTERS,
  DEFAULT_JOURNEY_PAGINATION,
} from '@/features/admin/journeys/models/journey-filters.model';

import type {
  JourneyFilters as JourneyFiltersModel,
  JourneyPagination as JourneyPaginationModel,
} from '@/features/admin/journeys/models/journey-filters.model';

import JourneyLoadingState from '@/components/admin/journeys/shared/JourneyLoadingState';
import JourneyErrorState from '@/components/admin/journeys/shared/JourneyErrorState';
import JourneyEmptyState from '@/components/admin/journeys/shared/JourneyEmptyState';

import JourneyDirectoryHeader from './JourneyDirectoryHeader';
import JourneySearch from './JourneySearch';
import JourneyFilters from './JourneyFilters';
import JourneyTable from './JourneyTable';
import JourneyPagination from './JourneyPagination';

const DEFAULT_PAGE_SIZE = DEFAULT_JOURNEY_PAGINATION.pageSize;

export interface JourneyDirectoryProps {
  readonly className?: string;
  readonly initialPageSize?: number;
}

function getJourneySearchText(journey: MappedJourney): string {
  return [
    journey.publicId,
    journey.providerPublicId,
    journey.corridor?.originName,
    journey.corridor?.destinationName,
    journey.status,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function matchesJourneyFilters(
  journey: MappedJourney,
  filters: JourneyFiltersModel,
): boolean {
  const normalizedSearch = filters.search.trim().toLowerCase();
  const normalizedProviderId = filters.providerPublicId.trim().toLowerCase();

  if (
    normalizedSearch &&
    !getJourneySearchText(journey).includes(normalizedSearch)
  ) {
    return false;
  }

  if (filters.status !== 'ALL' && journey.status !== filters.status) {
    return false;
  }

  if (
    normalizedProviderId &&
    !journey.providerPublicId.toLowerCase().includes(normalizedProviderId)
  ) {
    return false;
  }

  if (filters.departureFrom || filters.departureTo) {
    if (!journey.schedule) {
      return false;
    }

    const departureDate = journey.schedule.departureAt.slice(0, 10);

    if (
      filters.departureFrom &&
      departureDate < filters.departureFrom
    ) {
      return false;
    }

    if (
      filters.departureTo &&
      departureDate > filters.departureTo
    ) {
      return false;
    }
  }

  return true;
}

export function JourneyDirectory({
  className,
  initialPageSize = DEFAULT_PAGE_SIZE,
}: JourneyDirectoryProps) {
  const journeysQuery = useAllDetailedJourneys();

  const [filters, setFilters] = useState<JourneyFiltersModel>(() => ({
    ...DEFAULT_JOURNEY_FILTERS,
    providerPublicId: '',
  }));

  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(() =>
    Number.isFinite(initialPageSize) && initialPageSize >= 1
      ? Math.floor(initialPageSize)
      : DEFAULT_PAGE_SIZE,
  );

  const journeys = useMemo<MappedJourney[]>(
    () => journeysQuery.data ?? [],
    [journeysQuery.data],
  );

  const filteredJourneys = useMemo(
    () =>
      journeys.filter((journey) =>
        matchesJourneyFilters(journey, filters),
      ),
    [journeys, filters],
  );

  const totalPages = Math.ceil(filteredJourneys.length / pageSize);
  const safePage = Math.min(page, Math.max(1, totalPages));

  const pageJourneys = useMemo(() => {
    const start = (safePage - 1) * pageSize;

    return filteredJourneys.slice(start, start + pageSize);
  }, [filteredJourneys, safePage, pageSize]);

  const pagination = useMemo<JourneyPaginationModel>(
    () => ({
      page: safePage,
      pageSize,
      totalItems: filteredJourneys.length,
      totalPages,
    }),
    [safePage, pageSize, filteredJourneys.length, totalPages],
  );

  const hasActiveFilters =
    filters.search.trim().length > 0 ||
    filters.providerPublicId.trim().length > 0 ||
    filters.departureFrom.length > 0 ||
    filters.departureTo.length > 0 ||
    filters.status !== 'ALL';

  const handleSearchChange = (value: string) => {
    setFilters((current) => ({
      ...current,
      search: value,
    }));
    setPage(1);
  };

  const handleFiltersChange = (nextFilters: JourneyFiltersModel) => {
    setFilters(nextFilters);
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      ...DEFAULT_JOURNEY_FILTERS,
      providerPublicId: '',
    });
    setPage(1);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(Math.min(Math.max(1, nextPage), Math.max(1, totalPages)));
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    if (!Number.isFinite(nextPageSize) || nextPageSize < 1) {
      return;
    }

    setPageSize(Math.floor(nextPageSize));
    setPage(1);
  };

  if (journeysQuery.isPending) {
    return (
      <div className={className}>
        <JourneyLoadingState />
      </div>
    );
  }

  if (journeysQuery.isError) {
    return (
      <section className={cn('space-y-4', className)}>
        <JourneyErrorState
          title="Unable to load journeys"
          description="Journeys across providers could not be retrieved. Try again."
        />

        <button
          type="button"
          onClick={() => void journeysQuery.refetch()}
          disabled={journeysQuery.isFetching}
          className={cn(
            'inline-flex min-h-10 items-center justify-center rounded-xl',
            'border border-[var(--border)] px-4 py-2',
            'text-sm font-medium text-[var(--foreground)]',
            'transition hover:bg-[var(--background-subtle)]',
            'disabled:cursor-not-allowed disabled:opacity-60',
          )}
        >
          {journeysQuery.isFetching ? 'Retrying…' : 'Try again'}
        </button>
      </section>
    );
  }

  return (
    <section
      aria-label="Journey directory"
      className={cn('space-y-5', className)}
    >
      <JourneyDirectoryHeader totalItems={filteredJourneys.length} />

      <div className="space-y-4">
        <JourneySearch
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Search journey ID, route, provider, or status..."
          disabled={journeysQuery.isFetching}
        />

        <JourneyFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          resultCount={filteredJourneys.length}
          onReset={handleResetFilters}
          disabled={journeysQuery.isFetching}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p
          className="text-sm text-[var(--foreground-muted)]"
          aria-live="polite"
        >
          {filteredJourneys.length === 0
            ? 'No matching journeys'
            : `Showing ${pageJourneys.length} of ${filteredJourneys.length} journeys`}
        </p>

        <button
          type="button"
          onClick={() => void journeysQuery.refetch()}
          disabled={journeysQuery.isFetching}
          className={cn(
            'inline-flex min-h-9 items-center justify-center rounded-lg',
            'border border-[var(--border)] px-3 py-2',
            'text-sm font-medium text-[var(--foreground-secondary)]',
            'transition hover:bg-[var(--background-subtle)]',
            'disabled:cursor-not-allowed disabled:opacity-60',
          )}
        >
          {journeysQuery.isFetching ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {filteredJourneys.length === 0 ? (
        <JourneyEmptyState
          title={hasActiveFilters ? 'No matching journeys' : 'No journeys yet'}
          description={
            hasActiveFilters
              ? 'Try changing your search or filters.'
              : 'No journeys were returned by the platform journey API.'
          }
        />
      ) : (
        <>
          <JourneyTable
            journeys={pageJourneys}
            loading={false}
            error={false}
            onRetry={() => void journeysQuery.refetch()}
          />

          <JourneyPagination
            pagination={pagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={[10, 20, 50, 100]}
            disabled={journeysQuery.isFetching}
          />
        </>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-3">
        <p className="text-xs text-[var(--foreground-muted)]">
          Scope: <span className="font-medium">All providers</span>
        </p>

        <p className="text-xs text-[var(--foreground-muted)]">
          {journeysQuery.isFetching
            ? 'Refreshing data…'
            : 'Data from the platform journey API'}
        </p>
      </div>
    </section>
  );
}

export default JourneyDirectory;
