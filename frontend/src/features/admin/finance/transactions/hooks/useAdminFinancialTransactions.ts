
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { adminFinancialTransactionsApi } from '../api';
import type {
  AdminFinancialTransaction,
  AdminFinancialTransactionFilters,
} from '../models';
import { DEFAULT_ADMIN_FINANCIAL_TRANSACTION_FILTERS } from '../models';

export const adminFinancialTransactionKeys = {
  all: ['admin', 'financial-transactions'] as const,
  lists: () => [...adminFinancialTransactionKeys.all, 'list'] as const,
  list: () => [...adminFinancialTransactionKeys.lists(), 'all'] as const,
  details: () => [...adminFinancialTransactionKeys.all, 'detail'] as const,
  detail: (publicId: string) =>
    [...adminFinancialTransactionKeys.details(), publicId.trim()] as const,
  metrics: () => [...adminFinancialTransactionKeys.all, 'metrics'] as const,
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
  const reference = filters.reference?.trim().toLowerCase() ?? '';

  const createdFrom = filters.createdFrom
    ? toTimestamp(filters.createdFrom)
    : undefined;
  const createdTo = filters.createdTo
    ? toTimestamp(filters.createdTo)
    : undefined;

  const filtered = transactions.filter((transaction) => {
    if (
      filters.status &&
      filters.status !== 'ALL' &&
      transaction.status !== filters.status
    ) {
      return false;
    }

    if (
      filters.type &&
      filters.type !== 'ALL' &&
      transaction.type !== filters.type
    ) {
      return false;
    }

    if (
      currency &&
      currency !== 'ALL' &&
      transaction.currency.toUpperCase() !== currency
    ) {
      return false;
    }

    if (
      sourceAccountPublicId &&
      transaction.sourceAccountPublicId !== sourceAccountPublicId
    ) {
      return false;
    }

    if (
      destinationAccountPublicId &&
      transaction.destinationAccountPublicId !== destinationAccountPublicId
    ) {
      return false;
    }

    if (
      reference &&
      !(transaction.reference ?? '').toLowerCase().includes(reference)
    ) {
      return false;
    }

    const createdAt = toTimestamp(transaction.createdAt);

    if (createdFrom !== undefined && createdAt < createdFrom) {
      return false;
    }

    if (createdTo !== undefined && createdAt > createdTo) {
      return false;
    }

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

  const sortBy = filters.sortBy ?? 'createdAt';
  const direction = filters.sortDirection === 'asc' ? 1 : -1;

  return [...filtered].sort((a, b) => {
    if (sortBy === 'amount') {
      return (a.amount - b.amount) * direction;
    }

    if (sortBy === 'status') {
      return a.status.localeCompare(b.status) * direction;
    }

    return (
      (toTimestamp(a[sortBy]) - toTimestamp(b[sortBy])) *
      direction
    );
  });
}

export function useAdminFinancialTransactions(
  filters: AdminFinancialTransactionFilters =
    DEFAULT_ADMIN_FINANCIAL_TRANSACTION_FILTERS,
) {
  const query = useQuery({
    queryKey: adminFinancialTransactionKeys.list(),
    queryFn: () => adminFinancialTransactionsApi.getAll(),
  });

  const allTransactions = useMemo<AdminFinancialTransaction[]>(
    () => query.data ?? [],
    [query.data],
  );

  const filteredTransactions = useMemo(
    () => filterAdminFinancialTransactions(allTransactions, filters),
    [allTransactions, filters],
  );

  const pageSize = Math.max(1, filters.pageSize ?? 20);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / pageSize),
  );
  const currentPage = Math.min(
    Math.max(1, filters.page ?? 1),
    totalPages,
  );
  const start = (currentPage - 1) * pageSize;

  return {
    transactions: filteredTransactions.slice(start, start + pageSize),
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
