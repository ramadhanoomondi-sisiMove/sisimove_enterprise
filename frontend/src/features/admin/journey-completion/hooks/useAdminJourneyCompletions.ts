
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Journey Completions Query Hook
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Fetch journey completions through the authenticated API.
 * - Filter using supported backend filters.
 * - Sort and paginate the loaded collection on the client.
 * - Expose collection loading, error and refetch states.
 *
 * Architecture:
 * - API access remains in the API layer.
 * - TanStack Query manages server data and caching.
 * - Backend filtering uses only supported query parameters.
 * - Sorting and pagination are client-side.
 * -----------------------------------------------------------------------------
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { adminJourneyCompletionApi } from '../api';

import type {
  AdminJourneyCompletion,
  AdminJourneyCompletionFilters,
  AdminJourneyCompletionPage,
} from '../models';


// -----------------------------------------------------------------------------
// Pagination And Sorting Types
// -----------------------------------------------------------------------------

export interface AdminJourneyCompletionPagination {
  page?: number;
  pageSize?: number;
}

export type AdminJourneyCompletionSortBy =
  | 'publicId'
  | 'journeyPublicId'
  | 'providerPublicId'
  | 'status'
  | 'confirmedCount'
  | 'requiredConfirmations'
  | 'createdAt'
  | 'updatedAt'
  | 'completionRequestedAt'
  | 'confirmedAt';

export type AdminJourneyCompletionSortDirection = 'asc' | 'desc';

export interface AdminJourneyCompletionSort {
  sortBy?: AdminJourneyCompletionSortBy;
  sortDirection?: AdminJourneyCompletionSortDirection;
}

// -----------------------------------------------------------------------------
// Query Keys
// -----------------------------------------------------------------------------

export const adminJourneyCompletionKeys = {
  all: ['admin', 'journey-completions'] as const,

  lists: () =>
    [...adminJourneyCompletionKeys.all, 'list'] as const,

  list: (filters: AdminJourneyCompletionFilters = {}) =>
    [
      ...adminJourneyCompletionKeys.lists(),
      filters.journeyPublicId ?? null,
      filters.providerPublicId ?? null,
      filters.status ?? null,
    ] as const,

  details: () =>
    [...adminJourneyCompletionKeys.all, 'detail'] as const,

  detail: (publicId: string) =>
    [
      ...adminJourneyCompletionKeys.details(),
      publicId.trim(),
    ] as const,

  confirmations: (publicId: string) =>
    [
      ...adminJourneyCompletionKeys.detail(publicId),
      'confirmations',
    ] as const,

  disputes: (publicId: string) =>
    [
      ...adminJourneyCompletionKeys.detail(publicId),
      'disputes',
    ] as const,

  activity: (publicId: string) =>
    [
      ...adminJourneyCompletionKeys.detail(publicId),
      'activity',
    ] as const,

  metrics: () =>
    [...adminJourneyCompletionKeys.all, 'metrics'] as const,
};

// -----------------------------------------------------------------------------
// Date Helpers
// -----------------------------------------------------------------------------

function toTimestamp(value: string | undefined): number {
  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

// -----------------------------------------------------------------------------
// Filtering And Sorting
// -----------------------------------------------------------------------------

export function filterAdminJourneyCompletions(
  completions: AdminJourneyCompletion[],
  filters: AdminJourneyCompletionFilters,
  sort: AdminJourneyCompletionSort = {},
): AdminJourneyCompletion[] {
  const filtered = completions.filter((completion) => {
    if (
      filters.journeyPublicId !== undefined &&
      completion.journeyPublicId !== filters.journeyPublicId
    ) {
      return false;
    }

    if (
      filters.providerPublicId !== undefined &&
      completion.providerPublicId !== filters.providerPublicId
    ) {
      return false;
    }

    if (
      filters.status !== undefined &&
      completion.status !== filters.status
    ) {
      return false;
    }

    return true;
  });

  const sortBy = sort.sortBy ?? 'createdAt';
  const direction = sort.sortDirection === 'asc' ? 1 : -1;

  return [...filtered].sort((a, b) => {
    if (
      sortBy === 'createdAt' ||
      sortBy === 'updatedAt' ||
      sortBy === 'completionRequestedAt' ||
      sortBy === 'confirmedAt'
    ) {
      return (
        (toTimestamp(a[sortBy]) - toTimestamp(b[sortBy])) *
        direction
      );
    }

    if (
      sortBy === 'confirmedCount' ||
      sortBy === 'requiredConfirmations'
    ) {
      return (a[sortBy] - b[sortBy]) * direction;
    }

    return a[sortBy].localeCompare(b[sortBy]) * direction;
  });
}

// -----------------------------------------------------------------------------
// Query Hook
// -----------------------------------------------------------------------------

export function useAdminJourneyCompletions(
  filters: AdminJourneyCompletionFilters = {},
  pagination: AdminJourneyCompletionPagination = {},
  sort: AdminJourneyCompletionSort = {},
) {
  const query = useQuery({
    queryKey: adminJourneyCompletionKeys.list(filters),

    queryFn: () =>
      adminJourneyCompletionApi.list(filters),
  });

  const allCompletions = useMemo<AdminJourneyCompletion[]>(
    () => query.data ?? [],
    [query.data],
  );

  const filteredCompletions = useMemo(
    () =>
      filterAdminJourneyCompletions(
        allCompletions,
        filters,
        sort,
      ),
    [allCompletions, filters, sort],
  );

  const pageSize = Math.max(
    1,
    Math.floor(pagination.pageSize ?? 20),
  );

  const totalFiltered = filteredCompletions.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalFiltered / pageSize),
  );

  const currentPage = Math.min(
    Math.max(1, Math.floor(pagination.page ?? 1)),
    totalPages,
  );

  const start = (currentPage - 1) * pageSize;

  const completions = filteredCompletions.slice(
    start,
    start + pageSize,
  );

  const page: AdminJourneyCompletionPage<AdminJourneyCompletion> = {
    items: completions,
    page: currentPage,
    pageSize,
    totalItems: totalFiltered,
    totalPages,
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
  };

  return {
    completions,
    allCompletions,
    filteredCompletions,

    page,
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
