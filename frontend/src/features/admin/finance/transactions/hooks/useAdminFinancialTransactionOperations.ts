
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { adminFinancialTransactionsApi } from '../api';

import type {
  CompleteAdminFinancialTransactionPayload,
  FailAdminFinancialTransactionPayload,
  ReverseAdminFinancialTransactionPayload,
  CancelAdminFinancialTransactionPayload,
} from '../models';

import { adminFinancialTransactionKeys } from './useAdminFinancialTransactions';

export function useAdminFinancialTransactionOperations() {
  const queryClient = useQueryClient();

  const invalidateTransactionData = async () => {
    await queryClient.invalidateQueries({
      queryKey: adminFinancialTransactionKeys.all,
    });
  };

  const completeTransaction = useMutation({
    mutationFn: ({
      transactionPublicId,
      request,
    }: {
      transactionPublicId: string;
      request: CompleteAdminFinancialTransactionPayload;
    }) =>
      adminFinancialTransactionsApi.complete(transactionPublicId, request),
    onSuccess: invalidateTransactionData,
  });

  const failTransaction = useMutation({
    mutationFn: ({
      transactionPublicId,
      request,
    }: {
      transactionPublicId: string;
      request: FailAdminFinancialTransactionPayload;
    }) =>
      adminFinancialTransactionsApi.fail(transactionPublicId, request),
    onSuccess: invalidateTransactionData,
  });

  const reverseTransaction = useMutation({
    mutationFn: ({
      transactionPublicId,
      request,
    }: {
      transactionPublicId: string;
      request: ReverseAdminFinancialTransactionPayload;
    }) =>
      adminFinancialTransactionsApi.reverse(transactionPublicId, request),
    onSuccess: invalidateTransactionData,
  });

  const cancelTransaction = useMutation({
    mutationFn: ({
      transactionPublicId,
      request,
    }: {
      transactionPublicId: string;
      request: CancelAdminFinancialTransactionPayload;
    }) =>
      adminFinancialTransactionsApi.cancel(transactionPublicId, request),
    onSuccess: invalidateTransactionData,
  });

  return {
    completeTransaction,
    failTransaction,
    reverseTransaction,
    cancelTransaction,

    isPending:
      completeTransaction.isPending ||
      failTransaction.isPending ||
      reverseTransaction.isPending ||
      cancelTransaction.isPending,
  };
}
