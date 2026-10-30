
 // -----------------------------------------------------------------------------
 // sisiMove Admin — Payment Method Detail Hook
 // -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { adminPaymentMethodsApi } from '../api';

import { adminPaymentMethodKeys } from './useAdminPaymentMethods';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useAdminPaymentMethod(
  paymentMethodPublicId: string | undefined,
) {
  const publicId = paymentMethodPublicId?.trim() ?? '';

  const query = useQuery({
    queryKey: publicId
      ? adminPaymentMethodKeys.detail(publicId)
      : [
          ...adminPaymentMethodKeys.details(),
          'missing-public-id',
        ],

    queryFn: async () => {
      const paymentMethod =
        await adminPaymentMethodsApi.getByPublicId(publicId);

      if (!paymentMethod) {
        throw new Error(
          `Payment method "${publicId}" was not found.`,
        );
      }

      return paymentMethod;
    },

    enabled: publicId.length > 0,
  });

  return {
    paymentMethod: query.data,
    query,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export default useAdminPaymentMethod;
