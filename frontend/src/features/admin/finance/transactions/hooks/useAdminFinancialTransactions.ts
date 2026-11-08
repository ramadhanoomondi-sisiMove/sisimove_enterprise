import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { adminFinancialTransactionsApi } from '../api';

import type {
  AdminFinancialTransaction,
  AdminFinancialTransactionFilters,
} from '../models';

import {
  DEFAULT_ADMIN_FINANCIAL_TRANSACTION_FILTERS,
} from '../models';

// -----------------------------------------------------------------------------
// Query Keys
// -----------------------------------------------------------------------------

export const adminFinancialTransactionKeys = {
  all: ['admin', 'financial-transactions'] as const,

  lists: () =>
    [...adminFinancialTransactionKeys.all, 'list'] as const,

  list: () =>
    [...adminFinancialTransactionKeys.lists(), 'all'] as const,

  details: () =>
    [...adminFinancialTransactionKeys.all, 'detail'] as const,

  detail: (publicId: string) =>
    [...adminFinancialTransactionKeys.details(), publicId.trim()] as const,

  metrics: () =>
    [...adminFinancialTransactionKeys.all, 'metrics'] as const,
};

// -----------------------------------------------------------------------------
// Date Helpers
// -----------------------------------------------------------------------------

function toTimestamp(value: unknown): number | undefined {
  if (value instanceof Date) {
    const timestamp = value.getTime();

    return Number.isNaN(timestamp) ? undefined : timestamp;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const timestamp = new Date(value).getTime();

    return Number.isNaN(timestamp) ? undefined : timestamp;
  }

  return undefined;
}

/**
 * Parses a date filter.
 *
 * Date-only values are interpreted as calendar-day boundaries.
 * Timestamp values retain their exact time.
 */
function toDateBoundary(
  value: string | undefined,
  boundary: 'start' | 'end',
): number | undefined {
  if (!value?.trim()) {
    return undefined;
  }

  const normalizedValue = value.trim();

  // Handle date-picker values such as 2026-11-08.
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(
    normalizedValue,
  );

  if (dateOnlyMatch) {
    const year = Number(dateOnlyMatch[1]);
    const month = Number(dateOnlyMatch[2]);
    const day = Number(dateOnlyMatch[3]);

    const timestamp = Date.UTC(year, month - 1, day);

    const date = new Date(timestamp);

    // Reject impossible calendar dates.
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      return undefined;
    }

    if (boundary === 'end') {
      // Exclusive upper boundary: includes the entire selected day.
      return timestamp + 24 * 60 * 60 * 1000;
    }

    return timestamp;
  }

  return toTimestamp(normalizedValue);
}

// -----------------------------------------------------------------------------
// Transaction Filtering
// -----------------------------------------------------------------------------

export function filterAdminFinancialTransactions(
  transactions: AdminFinancialTransaction[],
  filters: AdminFinancialTransactionFilters,
): AdminFinancialTransaction[] {
  const search = filters.search?.trim().toLowerCase() ?? '';

  const currency = filters.currency?.trim().toUpperCase() ?? '';

  const sourceAccountPublicId =
    filters.sourceAccountPublicId?.trim() ?? '';

  const destinationAccountPublicId =
    filters.destinationAccountPublicId?.trim() ?? '';

  const reference =
    filters.reference?.trim().toLowerCase() ?? '';

  const createdFrom = toDateBoundary(
    filters.createdFrom,
    'start',
  );

  const createdTo = toDateBoundary(
    filters.createdTo,
    'end',
  );

  const filtered = transactions.filter((transaction) => {
    // -------------------------------------------------------------------------
    // Status
    // -------------------------------------------------------------------------

    if (
      filters.status &&
      filters.status !== 'ALL' &&
      transaction.status !== filters.status
    ) {
      return false;
    }

    // -------------------------------------------------------------------------
    // Transaction Type
    // -------------------------------------------------------------------------

    if (
      filters.type &&
      filters.type !== 'ALL' &&
      transaction.type !== filters.type
    ) {
      return false;
    }

    // -------------------------------------------------------------------------
    // Currency
    // -------------------------------------------------------------------------

    if (
      currency &&
      currency !== 'ALL' &&
      transaction.currency.toUpperCase() !== currency
    ) {
      return false;
    }

    // -------------------------------------------------------------------------
    // Source Account
    // -------------------------------------------------------------------------

    if (
      sourceAccountPublicId &&
      transaction.sourceAccountPublicId !== sourceAccountPublicId
    ) {
      return false;
    }

    // -------------------------------------------------------------------------
    // Destination Account
    // -------------------------------------------------------------------------

    if (
      destinationAccountPublicId &&
      transaction.destinationAccountPublicId !==
        destinationAccountPublicId
    ) {
      return false;
    }

    // -------------------------------------------------------------------------
    // Business Reference
    // -------------------------------------------------------------------------

    if (
      reference &&
      !(transaction.reference ?? '').toLowerCase().includes(reference)
    ) {
      return false;
    }

    // -------------------------------------------------------------------------
    // Creation Date
    // -------------------------------------------------------------------------

    const createdAt = toTimestamp(transaction.createdAt);

    if (
      createdFrom !== undefined &&
      (createdAt === undefined || createdAt < createdFrom)
    ) {
      return false;
    }

    if (
      createdTo !== undefined &&
      (createdAt === undefined || createdAt >= createdTo)
    ) {
      return false;
    }

    // -------------------------------------------------------------------------
    // General Search
    // -------------------------------------------------------------------------

    if (search) {
      const searchable = [
        transaction.publicId,
        transaction.type,
        transaction.status,
        transaction.currency,
        transaction.sourceAccountPublicId,
        transaction.destinationAccountPublicId,
        transaction.reference,
        transaction.accountingJournalPublicId,

        ...transaction.entries.flatMap((entry) => [
          entry.publicId,
          entry.accountPublicId,
          entry.type,
          entry.balanceType,
        ]),
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

  // ---------------------------------------------------------------------------
  // Sorting
  // ---------------------------------------------------------------------------

  const sortBy = filters.sortBy ?? 'createdAt';

  const direction = filters.sortDirection === 'asc' ? 1 : -1;

  return [...filtered].sort((a, b) => {
    if (sortBy === 'amount') {
      if (a.amount === b.amount) {
        return 0;
      }

      return (a.amount < b.amount ? -1 : 1) * direction;
    }

    if (sortBy === 'status') {
      return a.status.localeCompare(b.status) * direction;
    }

    const aTimestamp = toTimestamp(a[sortBy]);
    const bTimestamp = toTimestamp(b[sortBy]);

    const safeATimestamp = aTimestamp ?? 0;
    const safeBTimestamp = bTimestamp ?? 0;

    if (safeATimestamp === safeBTimestamp) {
      return 0;
    }

    return (
      (safeATimestamp < safeBTimestamp ? -1 : 1) *
      direction
    );
  });
}

// -----------------------------------------------------------------------------
// Admin Financial Transactions Query
// -----------------------------------------------------------------------------

export function useAdminFinancialTransactions(
  filters: AdminFinancialTransactionFilters =
    DEFAULT_ADMIN_FINANCIAL_TRANSACTION_FILTERS,
) {
  const query = useQuery({
    queryKey: adminFinancialTransactionKeys.list(),

    queryFn: () => adminFinancialTransactionsApi.getAll(),
  });

  // ---------------------------------------------------------------------------
  // All Transactions
  // ---------------------------------------------------------------------------

  const allTransactions = useMemo<AdminFinancialTransaction[]>(
    () => query.data ?? [],
    [query.data],
  );

  // ---------------------------------------------------------------------------
  // Filtered Transactions
  // ---------------------------------------------------------------------------

  const filteredTransactions = useMemo(
    () =>
      filterAdminFinancialTransactions(
        allTransactions,
        filters,
      ),
    [allTransactions, filters],
  );

  // ---------------------------------------------------------------------------
  // Pagination
  // ---------------------------------------------------------------------------

  const pageSize = Math.max(
    1,
    Math.floor(filters.pageSize ?? 20),
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / pageSize),
  );

  const currentPage = Math.min(
    Math.max(1, Math.floor(filters.page ?? 1)),
    totalPages,
  );

  const start = (currentPage - 1) * pageSize;

  const paginatedTransactions = filteredTransactions.slice(
    start,
    start + pageSize,
  );

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return {
    transactions: paginatedTransactions,

    allTransactions,

    filteredTransactions,

    totalFiltered: filteredTransactions.length,

    totalPages,

    currentPage,

    query,

    isLoading: query.isLoading,

    isFetching: query.isFetching,

    isError: query.isError,

    error: query.error,

    refetch: query.refetch,
  };
}
