
import { useQuery } from '@tanstack/react-query';

import { adminAccountHoldsApi } from '../api';
import { adminAccountHoldKeys } from './useAdminAccountHolds';

export function useAdminAccountHold(
  holdPublicId: string | undefined,
) {
  const publicId = holdPublicId?.trim() ?? '';

  const query = useQuery({
    queryKey: publicId
      ? adminAccountHoldKeys.detail(publicId)
      : [...adminAccountHoldKeys.details(), 'missing-public-id'],
    queryFn: async () => {
      const holds = await adminAccountHoldsApi.getAll();
      const hold = holds.find((item) => item.publicId === publicId);

      if (!hold) {
        throw new Error(`Account hold "${publicId}" was not found.`);
      }

      return hold;
    },
    enabled: publicId.length > 0,
  });

  return {
    hold: query.data,
    query,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
