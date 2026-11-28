
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Earning Commissions Query Hook
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Fetch earning commissions through the authenticated API.
 * - Filter earning commissions by search, type, status and creation date.
 * - Sort earning commissions using explicit sorting options.
 * - Paginate the filtered results.
 *
 * Architecture:
 * - API access remains in the API layer.
 * - Filtering, sorting and pagination are client-side.
 * - TanStack Query manages server data and caching.
 * - Query keys are shared with useAdminEarningCommission.
 * -----------------------------------------------------------------------------
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { adminCommissionsApi } from '../api';

import type {
  AdminCommissionFiltersModel,
  AdminEarningCommissionModel,
} from '../models';

// -----------------------------------------------------------------------------
// Pagination And Sorting Types
// -----------------------------------------------------------------------------

export interface AdminEarningCommissionPagination {
  page?: number;
  pageSize?: number;
}

export type AdminEarningCommissionSortBy =
  | 'journeyPublicId'
  | 'settlementPublicId'
  | 'providerPublicId'
  | 'percentage'
  | 'baseAmount'
  | 'commissionAmount'
  | 'netAmount'
  | 'currency'
  | 'status'
  | 'createdAt'
  | 'updatedAt'
  | 'assessedAt'
  | 'cancelledAt';

export type AdminEarningCommissionSortDirection = 'asc' | 'desc';

export interface AdminEarningCommissionSort {
  sortBy?: AdminEarningCommissionSortBy;
  sortDirection?: AdminEarningCommissionSortDirection;
}

// -----------------------------------------------------------------------------
// Query Keys
// -----------------------------------------------------------------------------

export const adminEarningCommissionKeys = {
  all: ['admin', 'earning-commissions'] as const,

  lists: () =>
    [...adminEarningCommissionKeys.all, 'list'] as const,

  list: () =>
    [...adminEarningCommissionKeys.lists(), 'all'] as const,

  details: () =>
    [...adminEarningCommissionKeys.all, 'detail'] as const,

  detail: (publicId: string) =>
    [
      ...adminEarningCommissionKeys.details(),
      publicId.trim(),
    ] as const,

  bySettlement: (settlementPublicId: string) =>
    [
      ...adminEarningCommissionKeys.all,
      'settlement',
      settlementPublicId.trim(),
    ] as const,

  byJourney: (journeyPublicId: string) =>
    [
      ...adminEarningCommissionKeys.all,
      'journey',
      journeyPublicId.trim(),
    ] as const,

  byProvider: (providerPublicId: string) =>
    [
      ...adminEarningCommissionKeys.all,
      'provider',
      providerPublicId.trim(),
    ] as const,
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
// Search Helpers
// -----------------------------------------------------------------------------

function normalizeSearch(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? '';
}

// -----------------------------------------------------------------------------
// Filtering And Sorting
// -----------------------------------------------------------------------------

export function filterAdminEarningCommissions(
  commissions: AdminEarningCommissionModel[],
  filters: AdminCommissionFiltersModel,
  sort: AdminEarningCommissionSort = {},
): AdminEarningCommissionModel[] {
  const search = normalizeSearch(filters.search);

  const createdFrom = filters.createdFrom
    ? toTimestamp(filters.createdFrom)
    : undefined;

  const createdTo = filters.createdTo
    ? toTimestamp(filters.createdTo)
    : undefined;

  const filtered = commissions.filter((commission) => {
    // -------------------------------------------------------------------------
    // Search
    // -------------------------------------------------------------------------

    if (search) {
      const searchableValues = [
        commission.publicId,
        commission.journeyPublicId,
        commission.settlementPublicId,
        commission.providerPublicId,
        commission.commissionRulePublicId,
        commission.currency,
      ];

      const matchesSearch = searchableValues.some((value) =>
        value.toLowerCase().includes(search),
      );

      if (!matchesSearch) {
        return false;
      }
    }

    // -------------------------------------------------------------------------
    // Commission Type
    // -------------------------------------------------------------------------

    if (
      filters.type !== undefined &&
      filters.type !== 'EARNING'
    ) {
      return false;
    }

    // -------------------------------------------------------------------------
    // Commission Status
    // -------------------------------------------------------------------------

    if (
      filters.status !== undefined &&
      commission.status !== filters.status
    ) {
      return false;
    }

    // -------------------------------------------------------------------------
    // Creation Date Range
    // -------------------------------------------------------------------------

    const createdAt = toTimestamp(commission.createdAt);

    if (
      createdFrom !== undefined &&
      createdAt < createdFrom
    ) {
      return false;
    }

    if (
      createdTo !== undefined &&
      createdAt > createdTo
    ) {
      return false;
    }

    return true;
  });

  // ---------------------------------------------------------------------------
  // Sorting
  // ---------------------------------------------------------------------------

  const sortBy = sort.sortBy ?? 'createdAt';
  const direction = sort.sortDirection === 'asc' ? 1 : -1;

  return [...filtered].sort((a, b) => {
    if (
      sortBy === 'createdAt' ||
      sortBy === 'updatedAt' ||
      sortBy === 'assessedAt' ||
      sortBy === 'cancelledAt'
    ) {
      return (
        (toTimestamp(a[sortBy]) - toTimestamp(b[sortBy])) *
        direction
      );
    }

    if (
      sortBy === 'percentage' ||
      sortBy === 'baseAmount' ||
      sortBy === 'commissionAmount' ||
      sortBy === 'netAmount'
    ) {
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

export function useAdminEarningCommissions(
  filters: AdminCommissionFiltersModel = {},
  pagination: AdminEarningCommissionPagination = {},
  sort: AdminEarningCommissionSort = {},
) {
  const query = useQuery({
    queryKey: adminEarningCommissionKeys.list(),
    queryFn: () => adminCommissionsApi.listEarningCommissions(),
  });

  const allCommissions = useMemo<AdminEarningCommissionModel[]>(
    () => query.data ?? [],
    [query.data],
  );

  const filteredCommissions = useMemo(
    () =>
      filterAdminEarningCommissions(
        allCommissions,
        filters,
        sort,
      ),
    [allCommissions, filters, sort],
  );

  // ---------------------------------------------------------------------------
  // Pagination
  // ---------------------------------------------------------------------------

  const pageSize = Math.max(
    1,
    Math.floor(pagination.pageSize ?? 20),
  );

  const totalFiltered = filteredCommissions.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalFiltered / pageSize),
  );

  const currentPage = Math.min(
    Math.max(1, Math.floor(pagination.page ?? 1)),
    totalPages,
  );

  const start = (currentPage - 1) * pageSize;

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return {
    commissions: filteredCommissions.slice(
      start,
      start + pageSize,
    ),

    allCommissions,
    filteredCommissions,

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
