
 // -----------------------------------------------------------------------------
 // sisiMove Admin — Payment Method Operations Hook
 // -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { adminPaymentMethodsApi } from '../api';

import type {
  AddAdminPaymentMethodPayload,
  AdminDeactivatePaymentMethodPayload,
  AdminSetDefaultPaymentMethodPayload,
} from '../api';

import { adminPaymentMethodKeys } from './useAdminPaymentMethods';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useAdminPaymentMethodOperations() {
  const queryClient = useQueryClient();

  const invalidatePaymentMethodData = async () => {
    await queryClient.invalidateQueries({
      queryKey: adminPaymentMethodKeys.all,
    });
  };

  const addPaymentMethod = useMutation({
    mutationFn: (request: AddAdminPaymentMethodPayload) =>
      adminPaymentMethodsApi.add(request),

    onSuccess: invalidatePaymentMethodData,
  });

  const setDefault = useMutation({
    mutationFn: ({
      paymentMethodPublicId,
      request,
    }: {
      paymentMethodPublicId: string;
      request: AdminSetDefaultPaymentMethodPayload;
    }) =>
      adminPaymentMethodsApi.setDefault(
        paymentMethodPublicId,
        request,
      ),

    onSuccess: invalidatePaymentMethodData,
  });

  const deactivate = useMutation({
    mutationFn: ({
      paymentMethodPublicId,
      request,
    }: {
      paymentMethodPublicId: string;
      request: AdminDeactivatePaymentMethodPayload;
    }) =>
      adminPaymentMethodsApi.deactivate(
        paymentMethodPublicId,
        request,
      ),

    onSuccess: invalidatePaymentMethodData,
  });

  return {
    addPaymentMethod,
    setDefault,
    deactivate,

    isPending:
      addPaymentMethod.isPending ||
      setDefault.isPending ||
      deactivate.isPending,
  };
}

export default useAdminPaymentMethodOperations;
