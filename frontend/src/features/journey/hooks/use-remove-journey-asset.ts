// -----------------------------------------------------------------------------
// sisiMove — useRemoveJourneyAsset
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { removeJourneyAsset } from '../api';

import { journeyAssetsQueryKeys } from './use-journey-assets';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useRemoveJourneyAsset() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    {
      journeyPublicId: string;
      assetPublicId: string;
    }
  >({
    mutationFn: ({ journeyPublicId, assetPublicId }) =>
      removeJourneyAsset(
        journeyPublicId,
        assetPublicId,
      ),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: journeyAssetsQueryKeys.list(
          variables.journeyPublicId,
        ),
      });
    },
  });
}