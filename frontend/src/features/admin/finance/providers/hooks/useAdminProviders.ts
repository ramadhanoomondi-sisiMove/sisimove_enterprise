
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Financial Payment Providers Query Hook
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Fetch financial payment providers through the authenticated API.
 * - Filter providers using AdminProviderFilters.
 * - Sort providers using explicit sorting options.
 * - Paginate the filtered results.
 *
 * Architecture:
 * - API access remains in the API layer.
 * - Filtering remains separate from pagination and sorting.
 * - Filtering, sorting and pagination are client-side.
 * - TanStack Query manages server data and caching.
 * -----------------------------------------------------------------------------
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { adminProvidersApi } from '../api';

import type {
  AdminProvider,
  AdminProviderFilters,
} from '../models';

// -----------------------------------------------------------------------------
// Pagination And Sorting Types
// -----------------------------------------------------------------------------

export interface AdminProviderPagination {
  page?: number;
  pageSize?: number;
}

export type AdminProviderSortBy =
  | 'code'
  | 'name'
  | 'type'
  | 'status'
  | 'environment'
  | 'createdAt'
  | 'updatedAt'
  | 'isEnabled'
  | 'isOperational';

export type AdminProviderSortDirection = 'asc' | 'desc';

export interface AdminProviderSort {
  sortBy?: AdminProviderSortBy;
  sortDirection?: AdminProviderSortDirection;
}

// -----------------------------------------------------------------------------
// Query Keys
// -----------------------------------------------------------------------------

export const adminProviderKeys = {
  all: ['admin', 'financial-payment-providers'] as const,

  lists: () => [...adminProviderKeys.all, 'list'] as const,

  list: () => [...adminProviderKeys.lists(), 'all'] as const,

  details: () => [...adminProviderKeys.all, 'detail'] as const,

  detail: (publicId: string) =>
    [...adminProviderKeys.details(), publicId.trim()] as const,

  metrics: () => [...adminProviderKeys.all, 'metrics'] as const,
};

// -----------------------------------------------------------------------------
// Date Helpers
// -----------------------------------------------------------------------------

function toTimestamp(value: unknown): number {
  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const timestamp = new Date(value).getTime();

    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  return 0;
}

// -----------------------------------------------------------------------------
// Filtering And Sorting
// -----------------------------------------------------------------------------

export function filterAdminProviders(
  providers: AdminProvider[],
  filters: AdminProviderFilters,
  sort: AdminProviderSort = {},
): AdminProvider[] {
  const filtered = providers.filter((provider) => {
    if (
      filters.type !== undefined &&
      provider.type !== filters.type
    ) {
      return false;
    }

    if (
      filters.status !== undefined &&
      provider.status !== filters.status
    ) {
      return false;
    }

    if (
      filters.environment !== undefined &&
      provider.environment !== filters.environment
    ) {
      return false;
    }

    if (
      filters.operational !== undefined &&
      provider.isOperational !== filters.operational
    ) {
      return false;
    }

    return true;
  });

  const sortBy = sort.sortBy ?? 'createdAt';
  const direction = sort.sortDirection === 'asc' ? 1 : -1;

  return [...filtered].sort((a, b) => {
    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      return (
        (toTimestamp(a[sortBy]) - toTimestamp(b[sortBy])) *
        direction
      );
    }

    if (sortBy === 'isEnabled' || sortBy === 'isOperational') {
      return (
        (Number(a[sortBy]) - Number(b[sortBy])) *
        direction
      );
    }

    return a[sortBy].localeCompare(b[sortBy]) * direction;
  });
}

// -----------------------------------------------------------------------------
// Query Hook
// -----------------------------------------------------------------------------

export function useAdminProviders(
  filters: AdminProviderFilters = {},
  pagination: AdminProviderPagination = {},
  sort: AdminProviderSort = {},
) {
  const query = useQuery({
    queryKey: adminProviderKeys.list(),
    queryFn: () => adminProvidersApi.list(),
  });

  const allProviders = useMemo<AdminProvider[]>(
    () => query.data ?? [],
    [query.data],
  );

  const filteredProviders = useMemo(
    () => filterAdminProviders(allProviders, filters, sort),
    [allProviders, filters, sort],
  );

  const pageSize = Math.max(
    1,
    Math.floor(pagination.pageSize ?? 20),
  );

  const totalFiltered = filteredProviders.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalFiltered / pageSize),
  );

  const currentPage = Math.min(
    Math.max(1, Math.floor(pagination.page ?? 1)),
    totalPages,
  );

  const start = (currentPage - 1) * pageSize;

  return {
    providers: filteredProviders.slice(start, start + pageSize),

    allProviders,
    filteredProviders,

    totalFiltered,
    totalPages,
    currentPage,
    pageSize,

    query,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
