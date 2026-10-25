
import { useQuery } from '@tanstack/react-query';

import { adminAccountHoldsApi } from '../api';
import { adminAccountHoldKeys } from './useAdminAccountHolds';

export function useAdminAccountHoldsByAccount(
  accountPublicId: string | undefined,
) {
  const publicId = accountPublicId?.trim() ?? '';

  const query = useQuery({
    queryKey: publicId
      ? adminAccountHoldKeys.account(publicId)
      : [...adminAccountHoldKeys.accounts(), 'missing-public-id'],
    queryFn: () =>
      adminAccountHoldsApi.getByAccountPublicId(publicId),
    enabled: publicId.length > 0,
  });

  return {
    holds: query.data ?? [],
    query,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
