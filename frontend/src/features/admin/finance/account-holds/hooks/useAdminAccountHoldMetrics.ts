
import { useQuery } from '@tanstack/react-query';

import { adminAccountHoldsApi } from '../api';
import type { AdminAccountHoldMetrics } from '../models';
import { adminAccountHoldKeys } from './useAdminAccountHolds';

function calculateMetrics(
  holds: Awaited<ReturnType<typeof adminAccountHoldsApi.getAll>>,
  currency: string,
): AdminAccountHoldMetrics {
  const currencyHolds = holds.filter(
    (hold) => hold.currency.toUpperCase() === currency,
  );

  const active = currencyHolds.filter(
    (hold) => hold.status === 'ACTIVE',
  );
  const released = currencyHolds.filter(
    (hold) => hold.status === 'RELEASED',
  );
  const captured = currencyHolds.filter(
    (hold) => hold.status === 'CAPTURED',
  );
  const cancelled = currencyHolds.filter(
    (hold) => hold.status === 'CANCELLED',
  );

  const sum = (items: typeof currencyHolds) =>
    items.reduce((total, hold) => total + hold.amount, 0);

  return {
    totalHolds: currencyHolds.length,
    activeHolds: active.length,
    releasedHolds: released.length,
    capturedHolds: captured.length,
    cancelledHolds: cancelled.length,
    expiredActiveHolds: active.filter((hold) => hold.isExpired).length,
    totalActiveHeldAmount: sum(active.filter((hold) => !hold.isExpired)),
    totalReleasedAmount: sum(released),
    totalCapturedAmount: sum(captured),
    totalCancelledAmount: sum(cancelled),
    currency,
  };
}

export function useAdminAccountHoldMetrics(
  requestedCurrency?: string,
) {
  const normalizedCurrency = requestedCurrency?.trim().toUpperCase() ?? '';

  const query = useQuery({
    queryKey: adminAccountHoldKeys.list(),
    queryFn: () => adminAccountHoldsApi.getAll(),
  });

  const holds = query.data ?? [];
  const currency =
    normalizedCurrency || holds[0]?.currency.toUpperCase() || 'KES';

  const metrics = calculateMetrics(holds, currency);

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
