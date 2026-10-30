// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Payment Operations Hook
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { adminFinancialPaymentsApi } from '../api';

import type {
  AdminFinancialPaymentLifecyclePayload,
  LinkAdminFinancialPaymentTransactionPayload,
} from '../api';

import { adminFinancialPaymentKeys } from './useAdminFinancialPayments';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useAdminFinancialPaymentOperations() {
  const queryClient = useQueryClient();

  const invalidatePaymentData = async () => {
    await queryClient.invalidateQueries({
      queryKey: adminFinancialPaymentKeys.all,
    });
  };

  const processPayment = useMutation({
    mutationFn: ({
      paymentPublicId,
      request,
    }: {
      paymentPublicId: string;
      request: AdminFinancialPaymentLifecyclePayload;
    }) => adminFinancialPaymentsApi.process(paymentPublicId, request),

    onSuccess: invalidatePaymentData,
  });

  const succeedPayment = useMutation({
    mutationFn: ({
      paymentPublicId,
      request,
    }: {
      paymentPublicId: string;
      request: AdminFinancialPaymentLifecyclePayload;
    }) => adminFinancialPaymentsApi.succeed(paymentPublicId, request),

    onSuccess: invalidatePaymentData,
  });

  const failPayment = useMutation({
    mutationFn: ({
      paymentPublicId,
      request,
    }: {
      paymentPublicId: string;
      request: AdminFinancialPaymentLifecyclePayload;
    }) => adminFinancialPaymentsApi.fail(paymentPublicId, request),

    onSuccess: invalidatePaymentData,
  });

  const cancelPayment = useMutation({
    mutationFn: ({
      paymentPublicId,
      request,
    }: {
      paymentPublicId: string;
      request: AdminFinancialPaymentLifecyclePayload;
    }) => adminFinancialPaymentsApi.cancel(paymentPublicId, request),

    onSuccess: invalidatePaymentData,
  });

  const expirePayment = useMutation({
    mutationFn: ({
      paymentPublicId,
      request,
    }: {
      paymentPublicId: string;
      request: AdminFinancialPaymentLifecyclePayload;
    }) => adminFinancialPaymentsApi.expire(paymentPublicId, request),

    onSuccess: invalidatePaymentData,
  });

  const linkTransaction = useMutation({
    mutationFn: ({
      paymentPublicId,
      request,
    }: {
      paymentPublicId: string;
      request: LinkAdminFinancialPaymentTransactionPayload;
    }) =>
      adminFinancialPaymentsApi.linkTransaction(paymentPublicId, request),

    onSuccess: invalidatePaymentData,
  });

  return {
    processPayment,
    succeedPayment,
    failPayment,
    cancelPayment,
    expirePayment,
    linkTransaction,

    isPending:
      processPayment.isPending ||
      succeedPayment.isPending ||
      failPayment.isPending ||
      cancelPayment.isPending ||
      expirePayment.isPending ||
      linkTransaction.isPending,
  };
}