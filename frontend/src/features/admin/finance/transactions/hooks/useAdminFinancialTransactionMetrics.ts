
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { adminFinancialTransactionsApi } from '../api';

import type {
  AdminFinancialTransaction,
  AdminFinancialTransactionMetrics,
} from '../models';

import {
  AdminFinancialTransactionStatus,
} from '../models';

import { adminFinancialTransactionKeys } from './useAdminFinancialTransactions';

function calculateMetrics(
  transactions: AdminFinancialTransaction[],
): AdminFinancialTransactionMetrics {
  const statusValues = Object.values(AdminFinancialTransactionStatus);

  const statusCounts = new Map<string, number>(
    statusValues.map((status) => [status, 0]),
  );

  const currencyVolumes = new Map<
    string,
    { amount: number; transactionCount: number }
  >();

  for (const transaction of transactions) {
    statusCounts.set(
      transaction.status,
      (statusCounts.get(transaction.status) ?? 0) + 1,
    );

    const current = currencyVolumes.get(transaction.currency) ?? {
      amount: 0,
      transactionCount: 0,
    };

    currencyVolumes.set(transaction.currency, {
      amount: current.amount + transaction.amount,
      transactionCount: current.transactionCount + 1,
    });
  }

  return {
    totalTransactions: transactions.length,

    pendingTransactions:
      statusCounts.get(AdminFinancialTransactionStatus.PENDING) ?? 0,

    completedTransactions:
      statusCounts.get(AdminFinancialTransactionStatus.COMPLETED) ?? 0,

    failedTransactions:
      statusCounts.get(AdminFinancialTransactionStatus.FAILED) ?? 0,

    reversedTransactions:
      statusCounts.get(AdminFinancialTransactionStatus.REVERSED) ?? 0,

    cancelledTransactions:
      statusCounts.get(AdminFinancialTransactionStatus.CANCELLED) ?? 0,

    volumeByCurrency: Array.from(currencyVolumes, ([currency, volume]) => ({
      currency,
      amount: volume.amount,
      transactionCount: volume.transactionCount,
    })).sort((a, b) => a.currency.localeCompare(b.currency)),

    statusBreakdown: statusValues.map((status) => ({
      status,
      count: statusCounts.get(status) ?? 0,
    })),

    scope: 'ALL_MATCHING',

    calculatedAt: new Date().toISOString(),
  };
}

export function useAdminFinancialTransactionMetrics() {
  const query = useQuery({
    queryKey: adminFinancialTransactionKeys.list(),
    queryFn: () => adminFinancialTransactionsApi.getAll(),
  });

  const metrics = useMemo(
    () =>
      query.data
        ? calculateMetrics(query.data)
        : undefined,
    [query.data],
  );

  return {
    metrics,
    query,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
