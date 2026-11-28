
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Booking Commissions Query Hook
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Fetch booking commissions through the authenticated API.
 * - Filter booking commissions by search, type, status and creation date.
 * - Sort booking commissions using explicit sorting options.
 * - Paginate the filtered results.
 *
 * Architecture:
 * - API access remains in the API layer.
 * - Filtering, sorting and pagination are client-side.
 * - TanStack Query manages server data and caching.
 * - Query keys are shared with useAdminBookingCommission.
 * -----------------------------------------------------------------------------
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { adminCommissionsApi } from '../api';

import type {
  AdminBookingCommissionModel,
  AdminCommissionFiltersModel,
} from '../models';

// -----------------------------------------------------------------------------
// Pagination And Sorting Types
// -----------------------------------------------------------------------------

export interface AdminBookingCommissionPagination {
  page?: number;
  pageSize?: number;
}

export type AdminBookingCommissionSortBy =
  | 'bookingPublicId'
  | 'journeyPublicId'
  | 'percentage'
  | 'baseAmount'
  | 'commissionAmount'
  | 'currency'
  | 'status'
  | 'createdAt'
  | 'updatedAt'
  | 'assessedAt'
  | 'cancelledAt';

export type AdminBookingCommissionSortDirection = 'asc' | 'desc';

export interface AdminBookingCommissionSort {
  sortBy?: AdminBookingCommissionSortBy;
  sortDirection?: AdminBookingCommissionSortDirection;
}

// -----------------------------------------------------------------------------
// Query Keys
// -----------------------------------------------------------------------------

export const adminBookingCommissionKeys = {
  all: ['admin', 'booking-commissions'] as const,

  lists: () =>
    [...adminBookingCommissionKeys.all, 'list'] as const,

  list: () =>
    [...adminBookingCommissionKeys.lists(), 'all'] as const,

  details: () =>
    [...adminBookingCommissionKeys.all, 'detail'] as const,

  detail: (publicId: string) =>
    [
      ...adminBookingCommissionKeys.details(),
      publicId.trim(),
    ] as const,

  byBooking: (bookingPublicId: string) =>
    [
      ...adminBookingCommissionKeys.all,
      'booking',
      bookingPublicId.trim(),
    ] as const,

  byJourney: (journeyPublicId: string) =>
    [
      ...adminBookingCommissionKeys.all,
      'journey',
      journeyPublicId.trim(),
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

export function filterAdminBookingCommissions(
  commissions: AdminBookingCommissionModel[],
  filters: AdminCommissionFiltersModel,
  sort: AdminBookingCommissionSort = {},
): AdminBookingCommissionModel[] {
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
        commission.bookingPublicId,
        commission.journeyPublicId,
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
      filters.type !== 'BOOKING'
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
      sortBy === 'commissionAmount'
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

export function useAdminBookingCommissions(
  filters: AdminCommissionFiltersModel = {},
  pagination: AdminBookingCommissionPagination = {},
  sort: AdminBookingCommissionSort = {},
) {
  const query = useQuery({
    queryKey: adminBookingCommissionKeys.list(),
    queryFn: () => adminCommissionsApi.listBookingCommissions(),
  });

  const allCommissions = useMemo<AdminBookingCommissionModel[]>(
    () => query.data ?? [],
    [query.data],
  );

  const filteredCommissions = useMemo(
    () =>
      filterAdminBookingCommissions(
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
