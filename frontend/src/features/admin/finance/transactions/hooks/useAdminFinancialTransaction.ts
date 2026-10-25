
import { useQuery } from '@tanstack/react-query';

import { adminFinancialTransactionsApi } from '../api';
import { adminFinancialTransactionKeys } from './useAdminFinancialTransactions';

export function useAdminFinancialTransaction(
  transactionPublicId: string | undefined,
) {
  const publicId = transactionPublicId?.trim() ?? '';

  const query = useQuery({
    queryKey: publicId
      ? adminFinancialTransactionKeys.detail(publicId)
      : [...adminFinancialTransactionKeys.details(), 'missing-public-id'],

    queryFn: async () => {
      const transaction =
        await adminFinancialTransactionsApi.getByPublicId(publicId);

      if (!transaction) {
        throw new Error(
          `Financial transaction "${publicId}" was not found.`,
        );
      }

      return transaction;
    },

    enabled: publicId.length > 0,
  });

  return {
    transaction: query.data,
    query,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
