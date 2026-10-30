
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Financial Payments Query Hooks
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Fetch financial payments through the authenticated API.
 * - Filter payments using AdminFinancialPaymentFilters.
 * - Sort payments using explicit pagination-independent options.
 * - Paginate the filtered results.
 *
 * Architecture:
 * - API access remains in the API layer.
 * - Filters remain separate from pagination and sorting.
 * - Filtering, sorting, and pagination are client-side.
 * -----------------------------------------------------------------------------
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { adminFinancialPaymentsApi } from '../api';

import type {
  AdminFinancialPayment,
  AdminFinancialPaymentFilters,
} from '../models';

import {
  DEFAULT_ADMIN_FINANCIAL_PAYMENT_FILTERS,
} from '../models';

// -----------------------------------------------------------------------------
// Pagination And Sorting Types
// -----------------------------------------------------------------------------

export interface AdminFinancialPaymentPagination {
  page?: number;
  pageSize?: number;
}

export type AdminFinancialPaymentSortBy =
  | 'createdAt'
  | 'updatedAt'
  | 'initiatedAt'
  | 'amount'
  | 'status';

export type AdminFinancialPaymentSortDirection = 'asc' | 'desc';

export interface AdminFinancialPaymentSort {
  sortBy?: AdminFinancialPaymentSortBy;
  sortDirection?: AdminFinancialPaymentSortDirection;
}

// -----------------------------------------------------------------------------
// Query Keys
// -----------------------------------------------------------------------------

export const adminFinancialPaymentKeys = {
  all: ['admin', 'financial-payments'] as const,

  lists: () => [...adminFinancialPaymentKeys.all, 'list'] as const,

  list: () => [...adminFinancialPaymentKeys.lists(), 'all'] as const,

  details: () => [...adminFinancialPaymentKeys.all, 'detail'] as const,

  detail: (publicId: string) =>
    [...adminFinancialPaymentKeys.details(), publicId.trim()] as const,

  metrics: () => [...adminFinancialPaymentKeys.all, 'metrics'] as const,
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

function normalizeDateBoundary(
  value: string | undefined,
  endOfDay = false,
): number | undefined {
  if (!value?.trim()) {
    return undefined;
  }

  const normalized = value.trim();

  const timestamp = toTimestamp(
    /^\d{4}-\d{2}-\d{2}$/.test(normalized)
      ? `${normalized}T${
          endOfDay ? '23:59:59.999' : '00:00:00.000'
        }`
      : normalized,
  );

  return Number.isNaN(timestamp)
    ? undefined
    : timestamp;
}

// -----------------------------------------------------------------------------
// Filtering And Sorting
// -----------------------------------------------------------------------------

export function filterAdminFinancialPayments(
  payments: AdminFinancialPayment[],
  filters: AdminFinancialPaymentFilters,
  sort: AdminFinancialPaymentSort = {},
): AdminFinancialPayment[] {
  const search = filters.search?.trim().toLowerCase() ?? '';
  const accountId = filters.accountId?.trim() ?? '';
  const methodId = filters.methodId?.trim() ?? '';
  const transactionPublicId =
    filters.transactionPublicId?.trim() ?? '';
  const referenceType =
    filters.referenceType?.trim().toLowerCase() ?? '';
  const referencePublicId =
    filters.referencePublicId?.trim() ?? '';

  const statuses = filters.statuses ?? [];

  const initiatedFrom = normalizeDateBoundary(filters.initiatedFrom);
  const initiatedTo = normalizeDateBoundary(filters.initiatedTo, true);
  const createdFrom = normalizeDateBoundary(filters.createdFrom);
  const createdTo = normalizeDateBoundary(filters.createdTo, true);

  const filtered = payments.filter((payment) => {
    if (statuses.length > 0 && !statuses.includes(payment.status)) {
      return false;
    }

    if (accountId && payment.accountId !== accountId) {
      return false;
    }

    if (methodId && payment.methodId !== methodId) {
      return false;
    }

    if (
      transactionPublicId &&
      payment.transactionPublicId !== transactionPublicId
    ) {
      return false;
    }

    if (
      referenceType &&
      !(payment.referenceType ?? '')
        .toLowerCase()
        .includes(referenceType)
    ) {
      return false;
    }

    if (
      referencePublicId &&
      payment.referencePublicId !== referencePublicId
    ) {
      return false;
    }

    const initiatedAt = toTimestamp(payment.initiatedAt);
    const createdAt = toTimestamp(payment.createdAt);

    if (initiatedFrom !== undefined && initiatedAt < initiatedFrom) {
      return false;
    }

    if (initiatedTo !== undefined && initiatedAt > initiatedTo) {
      return false;
    }

    if (createdFrom !== undefined && createdAt < createdFrom) {
      return false;
    }

    if (createdTo !== undefined && createdAt > createdTo) {
      return false;
    }

    if (search) {
      const searchable = [
        payment.publicId,
        payment.accountId,
        payment.amount,
        payment.currency,
        payment.status,
        payment.methodId,
        payment.transactionPublicId,
        payment.referenceType,
        payment.referencePublicId,
        ...payment.attempts.flatMap((attempt) => [
          attempt.publicId,
          attempt.status,
          attempt.provider,
          attempt.providerReference,
          attempt.failureCode,
          attempt.failureMessage,
        ]),
      ]
        .filter((value) => value !== null && value !== undefined)
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
    if (sortBy === 'amount') {
      return (a.amount - b.amount) * direction;
    }

    if (sortBy === 'status') {
      return a.status.localeCompare(b.status) * direction;
    }

    return (
      (toTimestamp(a[sortBy]) - toTimestamp(b[sortBy])) * direction
    );
  });
}

// -----------------------------------------------------------------------------
// Query Hook
// -----------------------------------------------------------------------------

export function useAdminFinancialPayments(
  filters: AdminFinancialPaymentFilters =
    DEFAULT_ADMIN_FINANCIAL_PAYMENT_FILTERS,
  pagination: AdminFinancialPaymentPagination = {},
  sort: AdminFinancialPaymentSort = {},
) {
  const query = useQuery({
    queryKey: adminFinancialPaymentKeys.list(),
    queryFn: () => adminFinancialPaymentsApi.getAll(),
  });

  const allPayments = useMemo<AdminFinancialPayment[]>(
    () => query.data ?? [],
    [query.data],
  );

  const filteredPayments = useMemo(
    () => filterAdminFinancialPayments(allPayments, filters, sort),
    [allPayments, filters, sort],
  );

  const pageSize = Math.max(
    1,
    Math.floor(pagination.pageSize ?? 20),
  );

  const totalFiltered = filteredPayments.length;

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
    payments: filteredPayments.slice(start, start + pageSize),
    allPayments,
    filteredPayments,
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
