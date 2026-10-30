// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Payment Detail Hook
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { adminFinancialPaymentsApi } from '../api';

import { adminFinancialPaymentKeys } from './useAdminFinancialPayments';

export function useAdminFinancialPayment(
  paymentPublicId: string | undefined,
) {
  const publicId = paymentPublicId?.trim() ?? '';

  const query = useQuery({
    queryKey: publicId
      ? adminFinancialPaymentKeys.detail(publicId)
      : [...adminFinancialPaymentKeys.details(), 'missing-public-id'],

    queryFn: async () => {
      const payment =
        await adminFinancialPaymentsApi.getByPublicId(publicId);

      if (!payment) {
        throw new Error(
          `Financial payment "${publicId}" was not found.`,
        );
      }

      return payment;
    },

    enabled: publicId.length > 0,
  });

  return {
    payment: query.data,
    query,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}