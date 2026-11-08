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

// -----------------------------------------------------------------------------
// Metrics Calculation
// -----------------------------------------------------------------------------

/**
 * Calculates administrative transaction metrics.
 *
 * Gross Transaction Volume:
 * - Includes transactions across all statuses.
 * - Groups amounts by currency.
 * - Does not represent completed payment volume or net financial movement.
 *
 * All amounts remain integer minor units.
 */
function calculateMetrics(
  transactions: AdminFinancialTransaction[],
): AdminFinancialTransactionMetrics {
  // ---------------------------------------------------------------------------
  // Status Counts
  // ---------------------------------------------------------------------------

  const statusValues = Object.values(
    AdminFinancialTransactionStatus,
  );

  const statusCounts = new Map<
    AdminFinancialTransactionStatus,
    number
  >(
    statusValues.map((status) => [status, 0]),
  );

  // ---------------------------------------------------------------------------
  // Currency Volumes
  // ---------------------------------------------------------------------------

  const currencyVolumes = new Map<
    string,
    {
      amount: number;
      transactionCount: number;
    }
  >();

  // ---------------------------------------------------------------------------
  // Aggregate Transactions
  // ---------------------------------------------------------------------------

  for (const transaction of transactions) {
    // Status count.
    statusCounts.set(
      transaction.status,
      (statusCounts.get(transaction.status) ?? 0) + 1,
    );

    // Currency volume.
    const current = currencyVolumes.get(transaction.currency) ?? {
      amount: 0,
      transactionCount: 0,
    };

    const nextAmount = current.amount + transaction.amount;

    // Prevent unsafe monetary aggregation.
    if (!Number.isSafeInteger(nextAmount)) {
      throw new Error(
        `Financial transaction volume exceeds the safe integer limit for ${transaction.currency}.`,
      );
    }

    currencyVolumes.set(transaction.currency, {
      amount: nextAmount,
      transactionCount: current.transactionCount + 1,
    });
  }

  // ---------------------------------------------------------------------------
  // Build Metrics
  // ---------------------------------------------------------------------------

  return {
    totalTransactions: transactions.length,

    pendingTransactions:
      statusCounts.get(
        AdminFinancialTransactionStatus.PENDING,
      ) ?? 0,

    completedTransactions:
      statusCounts.get(
        AdminFinancialTransactionStatus.COMPLETED,
      ) ?? 0,

    failedTransactions:
      statusCounts.get(
        AdminFinancialTransactionStatus.FAILED,
      ) ?? 0,

    reversedTransactions:
      statusCounts.get(
        AdminFinancialTransactionStatus.REVERSED,
      ) ?? 0,

    cancelledTransactions:
      statusCounts.get(
        AdminFinancialTransactionStatus.CANCELLED,
      ) ?? 0,

    volumeByCurrency: Array.from(
      currencyVolumes,
      ([currency, volume]) => ({
        currency,
        amount: volume.amount,
        transactionCount: volume.transactionCount,
      }),
    ).sort((a, b) => a.currency.localeCompare(b.currency)),

    statusBreakdown: statusValues.map((status) => ({
      status,
      count: statusCounts.get(status) ?? 0,
    })),

    scope: 'ALL_MATCHING',

    calculatedAt: new Date().toISOString(),
  };
}

// -----------------------------------------------------------------------------
// Admin Financial Transaction Metrics Query
// -----------------------------------------------------------------------------

export function useAdminFinancialTransactionMetrics() {
  const query = useQuery({
    queryKey: adminFinancialTransactionKeys.list(),

    queryFn: () => adminFinancialTransactionsApi.getAll(),
  });

  // ---------------------------------------------------------------------------
  // Metrics
  // ---------------------------------------------------------------------------

  const metrics = useMemo(
    () =>
      query.data
        ? calculateMetrics(query.data)
        : undefined,
    [query.data],
  );

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

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
