
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Payment Methods Query Hooks
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Fetch payment methods through the authenticated API.
 * - Filter and sort the collection on the client.
 * - Paginate the filtered results.
 * - Provide shared query keys for related payment-method hooks.
 * -----------------------------------------------------------------------------
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { adminPaymentMethodsApi } from '../api';

import type { AdminPaymentMethod } from '../models';

// -----------------------------------------------------------------------------
// Pagination And Sorting Types
// -----------------------------------------------------------------------------

export interface AdminPaymentMethodPagination {
  page?: number;
  pageSize?: number;
}

export type AdminPaymentMethodSortBy =
  | 'createdAt'
  | 'updatedAt'
  | 'provider'
  | 'type'
  | 'displayName';

export type AdminPaymentMethodSortDirection = 'asc' | 'desc';

export interface AdminPaymentMethodSort {
  sortBy?: AdminPaymentMethodSortBy;
  sortDirection?: AdminPaymentMethodSortDirection;
}

// -----------------------------------------------------------------------------
// Query Keys
// -----------------------------------------------------------------------------

export const adminPaymentMethodKeys = {
  all: ['admin', 'payment-methods'] as const,

  lists: () => [...adminPaymentMethodKeys.all, 'list'] as const,

  list: () => [...adminPaymentMethodKeys.lists(), 'all'] as const,

  details: () => [...adminPaymentMethodKeys.all, 'detail'] as const,

  detail: (publicId: string) =>
    [...adminPaymentMethodKeys.details(), publicId.trim()] as const,

  metrics: () => [...adminPaymentMethodKeys.all, 'metrics'] as const,
};

// -----------------------------------------------------------------------------
// Filtering And Sorting
// -----------------------------------------------------------------------------

export interface AdminPaymentMethodFilters {
  search?: string;
  accountPublicId?: string;
  providers?: string[];
  types?: string[];
  activeState?: 'all' | 'active' | 'inactive';
  defaultState?: 'all' | 'default' | 'non-default';
}

export function filterAdminPaymentMethods(
  paymentMethods: AdminPaymentMethod[],
  filters: AdminPaymentMethodFilters = {},
  sort: AdminPaymentMethodSort = {},
): AdminPaymentMethod[] {
  const search = filters.search?.trim().toLowerCase() ?? '';
  const accountPublicId = filters.accountPublicId?.trim() ?? '';

  const filtered = paymentMethods.filter((method) => {
    if (
      accountPublicId &&
      method.accountPublicId !== accountPublicId
    ) {
      return false;
    }

    if (
      filters.providers?.length &&
      !filters.providers.includes(method.provider)
    ) {
      return false;
    }

    if (
      filters.types?.length &&
      !filters.types.includes(method.type)
    ) {
      return false;
    }

    if (
      filters.activeState === 'active' &&
      !method.isActive
    ) {
      return false;
    }

    if (
      filters.activeState === 'inactive' &&
      method.isActive
    ) {
      return false;
    }

    if (
      filters.defaultState === 'default' &&
      !method.isDefault
    ) {
      return false;
    }

    if (
      filters.defaultState === 'non-default' &&
      method.isDefault
    ) {
      return false;
    }

    if (search) {
      const searchable = [
        method.publicId,
        method.accountPublicId,
        method.provider,
        method.type,
        method.displayName,
        method.providerReference,
        method.lastFour,
      ]
        .filter(
          (value) => value !== null && value !== undefined,
        )
        .join(' ')
        .toLowerCase();

      if (!searchable.includes(search)) {
        return false;
      }
    }

    return true;
  });

  const sortBy = sort.sortBy ?? 'createdAt';
  const direction = sort.sortDirection === 'asc' ? 1 : -1;

  return [...filtered].sort((a, b) => {
    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      const aTime = new Date(a[sortBy]).getTime();
      const bTime = new Date(b[sortBy]).getTime();

      return (aTime - bTime) * direction;
    }

    return (
      String(a[sortBy] ?? '').localeCompare(
        String(b[sortBy] ?? ''),
      ) * direction
    );
  });
}

// -----------------------------------------------------------------------------
// Query Hook
// -----------------------------------------------------------------------------

export function useAdminPaymentMethods(
  filters: AdminPaymentMethodFilters = {},
  pagination: AdminPaymentMethodPagination = {},
  sort: AdminPaymentMethodSort = {},
) {
  const query = useQuery({
    queryKey: adminPaymentMethodKeys.list(),
    queryFn: () => adminPaymentMethodsApi.getAll(),
  });

  const allPaymentMethods = useMemo<AdminPaymentMethod[]>(
    () => query.data ?? [],
    [query.data],
  );

  const filteredPaymentMethods = useMemo(
    () => filterAdminPaymentMethods(allPaymentMethods, filters, sort),
    [allPaymentMethods, filters, sort],
  );

  const pageSize = Math.max(
    1,
    Math.floor(pagination.pageSize ?? 20),
  );

  const totalFiltered = filteredPaymentMethods.length;

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
    paymentMethods: filteredPaymentMethods.slice(
      start,
      start + pageSize,
    ),
    allPaymentMethods,
    filteredPaymentMethods,
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

export default useAdminPaymentMethods;
