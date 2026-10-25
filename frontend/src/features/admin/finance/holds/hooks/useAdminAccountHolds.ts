
// src/features/admin/finance/account-holds/hooks/useAdminAccountHolds.ts

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { adminAccountHoldsApi } from '../api';
import type {
  AdminAccountHold,
  AdminAccountHoldFilters,
} from '../models';
import { DEFAULT_ADMIN_ACCOUNT_HOLD_FILTERS } from '../models';

export const adminAccountHoldKeys = {
  all: ['admin', 'account-holds'] as const,
  lists: () => [...adminAccountHoldKeys.all, 'list'] as const,
  list: () => [...adminAccountHoldKeys.lists(), 'all'] as const,
  accounts: () => [...adminAccountHoldKeys.all, 'account'] as const,
  account: (publicId: string) =>
    [...adminAccountHoldKeys.accounts(), publicId.trim()] as const,
  details: () => [...adminAccountHoldKeys.all, 'detail'] as const,
  detail: (publicId: string) =>
    [...adminAccountHoldKeys.details(), publicId.trim()] as const,
  metrics: () => [...adminAccountHoldKeys.all, 'metrics'] as const,
  metric: (currency: string) =>
    [...adminAccountHoldKeys.metrics(), currency.toUpperCase()] as const,
};

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

function sortHolds(
  holds: AdminAccountHold[],
  filters: AdminAccountHoldFilters,
): AdminAccountHold[] {
  const sortBy = filters.sortBy ?? 'createdAt';
  const direction = filters.sortDirection === 'asc' ? 1 : -1;

  return [...holds].sort((a, b) => {
    if (sortBy === 'amount') {
      return (a.amount - b.amount) * direction;
    }

    return (
      (toTimestamp(a[sortBy]) - toTimestamp(b[sortBy])) *
      direction
    );
  });
}

export function useAdminAccountHolds(
  filters: AdminAccountHoldFilters = DEFAULT_ADMIN_ACCOUNT_HOLD_FILTERS,
) {
  const query = useQuery({
    queryKey: adminAccountHoldKeys.list(),
    queryFn: () => adminAccountHoldsApi.getAll(),
  });

  // Keep the fallback array stable when query.data is undefined.
  const allHolds = useMemo<AdminAccountHold[]>(
    () => query.data ?? [],
    [query.data],
  );

  const filteredHolds = useMemo(() => {
    const search = filters.search?.trim().toLowerCase() ?? '';
    const accountPublicId = filters.accountPublicId?.trim() ?? '';
    const referenceType = filters.referenceType?.trim() ?? '';
    const currency = filters.currency?.trim().toUpperCase() ?? '';

    const filtered = allHolds.filter((hold) => {
      if (
        filters.status &&
        filters.status !== 'ALL' &&
        hold.status !== filters.status
      ) {
        return false;
      }

      if (
        accountPublicId &&
        hold.accountPublicId !== accountPublicId
      ) {
        return false;
      }

      if (
        referenceType &&
        hold.referenceType !== referenceType
      ) {
        return false;
      }

      if (currency && hold.currency.toUpperCase() !== currency) {
        return false;
      }

      if (
        filters.expired !== undefined &&
        hold.isExpired !== filters.expired
      ) {
        return false;
      }

      if (search) {
        const searchable = [
          hold.publicId,
          hold.accountPublicId,
          hold.referenceType,
          hold.referencePublicId,
          hold.status,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!searchable.includes(search)) {
          return false;
        }
      }

      return true;
    });

    return sortHolds(filtered, filters);
  }, [allHolds, filters]);

  const pageSize = Math.max(1, filters.pageSize ?? 20);
  const pageCount = Math.max(
    1,
    Math.ceil(filteredHolds.length / pageSize),
  );

  const page = Math.min(
    Math.max(1, filters.page ?? 1),
    pageCount,
  );

  const start = (page - 1) * pageSize;

  return {
    holds: filteredHolds.slice(start, start + pageSize),
    allHolds,
    totalFiltered: filteredHolds.length,
    totalPages: pageCount,
    currentPage: page,
    query,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
