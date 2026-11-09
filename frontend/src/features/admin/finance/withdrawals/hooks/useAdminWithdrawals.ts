
/**
 * -----------------------------------------------------------------------------
 * SisiMove Admin — Financial Account Withdrawals Query Hook
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Fetch financial account withdrawals through the authenticated API.
 * - Filter withdrawals using AdminWithdrawalFilters.
 * - Sort withdrawals using explicit sorting options.
 * - Paginate filtered results.
 *
 * Architecture:
 * - API access remains in the API layer.
 * - TanStack Query manages server data and caching.
 * - Filtering, sorting and pagination are client-side.
 * -----------------------------------------------------------------------------
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { AdminWithdrawalsApi } from '../api';

import type {
  AdminWithdrawal,
  AdminWithdrawalFilters,
  AdminWithdrawalSortField,
  AdminWithdrawalSortDirection,
  AdminPageParameters,
} from '../models';

import {
  DEFAULT_ADMIN_WITHDRAWAL_FILTERS,
  DEFAULT_ADMIN_WITHDRAWAL_PAGE,
  calculateAdminPageMetadata,
} from '../models';

// -----------------------------------------------------------------------------
// Sorting Types
// -----------------------------------------------------------------------------

export interface AdminWithdrawalSort {
  sortBy?: AdminWithdrawalSortField;
  sortDirection?: AdminWithdrawalSortDirection;
}

// -----------------------------------------------------------------------------
// Query Keys
// -----------------------------------------------------------------------------

export const adminWithdrawalKeys = {
  all: ['admin', 'financial-account-withdrawals'] as const,

  lists: () => [...adminWithdrawalKeys.all, 'list'] as const,

  list: () => [...adminWithdrawalKeys.lists(), 'all'] as const,

  details: () => [...adminWithdrawalKeys.all, 'detail'] as const,

  detail: (publicId: string) =>
    [...adminWithdrawalKeys.details(), publicId.trim()] as const,

  accounts: () => [...adminWithdrawalKeys.all, 'account'] as const,

  account: (accountPublicId: string) =>
    [...adminWithdrawalKeys.accounts(), accountPublicId.trim()] as const,

  accountStatus: (
    accountPublicId: string,
    status: string,
  ) =>
    [
      ...adminWithdrawalKeys.account(accountPublicId),
      'status',
      status,
    ] as const,

  metrics: () => [...adminWithdrawalKeys.all, 'metrics'] as const,
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

function getDateBoundary(value: string, endOfDay = false): number {
  const normalizedValue =
    endOfDay && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? `${value}T23:59:59.999`
      : value;

  return toTimestamp(normalizedValue);
}

// -----------------------------------------------------------------------------
// Filtering And Sorting
// -----------------------------------------------------------------------------

export function filterAdminWithdrawals(
  withdrawals: AdminWithdrawal[],
  filters: AdminWithdrawalFilters = DEFAULT_ADMIN_WITHDRAWAL_FILTERS,
  sort: AdminWithdrawalSort = {},
): AdminWithdrawal[] {
  const search = filters.search.trim().toLowerCase();

  const filtered = withdrawals.filter((withdrawal) => {
    if (
      filters.status !== 'ALL' &&
      withdrawal.status !== filters.status
    ) {
      return false;
    }

    if (
      filters.destinationType !== 'ALL' &&
      withdrawal.destinationType !== filters.destinationType
    ) {
      return false;
    }

    if (
      filters.accountPublicId.trim() &&
      withdrawal.accountPublicId !== filters.accountPublicId.trim()
    ) {
      return false;
    }

    if (
      filters.currency.trim() &&
      withdrawal.currency.toLowerCase() !==
        filters.currency.trim().toLowerCase()
    ) {
      return false;
    }

    const requestedAt = toTimestamp(withdrawal.requestedAt);

    if (filters.dateFrom) {
      const dateFrom = getDateBoundary(filters.dateFrom);

      if (requestedAt < dateFrom) {
        return false;
      }
    }

    if (filters.dateTo) {
      const dateTo = getDateBoundary(filters.dateTo, true);

      if (requestedAt > dateTo) {
        return false;
      }
    }

    if (search) {
      const searchableText = [
        withdrawal.publicId,
        withdrawal.accountPublicId,
        withdrawal.destinationValue,
        withdrawal.destinationType,
        withdrawal.status,
        withdrawal.currency,
        withdrawal.referenceType ?? '',
        withdrawal.referencePublicId ?? '',
        withdrawal.disbursementPublicId ?? '',
      ]
        .join(' ')
        .toLowerCase();

      if (!searchableText.includes(search)) {
        return false;
      }
    }

    return true;
  });

  const sortBy = sort.sortBy ?? 'requestedAt';
  const direction = sort.sortDirection === 'asc' ? 1 : -1;

  return [...filtered].sort((a, b) => {
    if (
      sortBy === 'requestedAt' ||
      sortBy === 'createdAt' ||
      sortBy === 'updatedAt'
    ) {
      return (
        (toTimestamp(a[sortBy]) - toTimestamp(b[sortBy])) *
        direction
      );
    }

    return (a.amount - b.amount) * direction;
  });
}

// -----------------------------------------------------------------------------
// Query Hook
// -----------------------------------------------------------------------------

export function useAdminWithdrawals(
  filters: AdminWithdrawalFilters = DEFAULT_ADMIN_WITHDRAWAL_FILTERS,
  pagination: AdminPageParameters = DEFAULT_ADMIN_WITHDRAWAL_PAGE,
  sort: AdminWithdrawalSort = {},
) {
  const query = useQuery({
    queryKey: adminWithdrawalKeys.list(),
    queryFn: () => AdminWithdrawalsApi.getAll(),
  });

  const allWithdrawals = useMemo<AdminWithdrawal[]>(
    () => query.data ?? [],
    [query.data],
  );

  const filteredWithdrawals = useMemo(
    () => filterAdminWithdrawals(allWithdrawals, filters, sort),
    [allWithdrawals, filters, sort],
  );

  const pageSize = Math.max(
    1,
    Math.floor(pagination.pageSize ?? 20),
  );

  const totalFiltered = filteredWithdrawals.length;

  const paginationMetadata = calculateAdminPageMetadata(
    totalFiltered,
    pagination.page ?? 1,
    pageSize,
  );

  const currentPage = paginationMetadata.page;

  const start = (currentPage - 1) * pageSize;

  return {
    withdrawals: filteredWithdrawals.slice(
      start,
      start + pageSize,
    ),

    allWithdrawals,
    filteredWithdrawals,

    totalFiltered,

    pagination: paginationMetadata,

    totalPages: paginationMetadata.totalPages,
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
