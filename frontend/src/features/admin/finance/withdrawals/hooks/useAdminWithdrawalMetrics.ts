
/**
 * -----------------------------------------------------------------------------
 * SisiMove Admin — Financial Account Withdrawal Metrics Hook
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Read the cached withdrawal collection.
 * - Calculate withdrawal status counts.
 * - Calculate withdrawal amounts grouped by currency.
 *
 * Architecture:
 * - TanStack Query shares the collection cache with useAdminWithdrawals.
 * - Metric calculations remain in the model layer.
 * -----------------------------------------------------------------------------
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { AdminWithdrawalsApi } from '../api';

import {
  calculateAdminWithdrawalMetrics,
  EMPTY_ADMIN_WITHDRAWAL_METRICS,
} from '../models/admin-withdrawal-metrics.model';

import type { AdminWithdrawal } from '../models/admin-withdrawal.model';

import { adminWithdrawalKeys } from './useAdminWithdrawals';

// -----------------------------------------------------------------------------
// Query Hook
// -----------------------------------------------------------------------------

export function useAdminWithdrawalMetrics() {
  const query = useQuery({
    queryKey: adminWithdrawalKeys.list(),
    queryFn: () => AdminWithdrawalsApi.getAll(),
  });

  const allWithdrawals = useMemo<AdminWithdrawal[]>(
    () => query.data ?? [],
    [query.data],
  );

  const metrics = useMemo(
    () =>
      query.data
        ? calculateAdminWithdrawalMetrics(allWithdrawals)
        : EMPTY_ADMIN_WITHDRAWAL_METRICS,
    [query.data, allWithdrawals],
  );

  return {
    metrics,

    totalWithdrawals: metrics.totalWithdrawals,
    statusCounts: metrics.statusCounts,
    amountsByCurrency: metrics.amountsByCurrency,

    query,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export default useAdminWithdrawalMetrics;
