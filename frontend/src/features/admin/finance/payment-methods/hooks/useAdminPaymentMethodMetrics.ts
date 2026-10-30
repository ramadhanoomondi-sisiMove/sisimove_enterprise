
 // -----------------------------------------------------------------------------
 // sisiMove Admin — Payment Method Metrics Hook
 // -----------------------------------------------------------------------------

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { adminPaymentMethodsApi } from '../api';

import type { AdminPaymentMethod } from '../models';

import { adminPaymentMethodKeys } from './useAdminPaymentMethods';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useAdminPaymentMethodMetrics() {
  const query = useQuery({
    queryKey: adminPaymentMethodKeys.list(),
    queryFn: () => adminPaymentMethodsApi.getAll(),
  });

  const paymentMethods = query.data ?? [];

  const metrics = useMemo(() => {
    const byProvider: Record<string, number> = {};
    const byType: Record<string, number> = {};

    for (const method of paymentMethods) {
      byProvider[method.provider] =
        (byProvider[method.provider] ?? 0) + 1;

      byType[method.type] =
        (byType[method.type] ?? 0) + 1;
    }

    return {
      totalPaymentMethods: paymentMethods.length,

      activePaymentMethods: paymentMethods.filter(
        (method: AdminPaymentMethod) => method.isActive,
      ).length,

      inactivePaymentMethods: paymentMethods.filter(
        (method: AdminPaymentMethod) => !method.isActive,
      ).length,

      defaultPaymentMethods: paymentMethods.filter(
        (method: AdminPaymentMethod) => method.isDefault,
      ).length,

      providerCounts: byProvider,
      typeCounts: byType,
    };
  }, [paymentMethods]);

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

export default useAdminPaymentMethodMetrics;
