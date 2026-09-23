// -----------------------------------------------------------------------------
// sisiMove — useAttachJourneyAsset
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  attachJourneyAsset,
  type AttachJourneyAssetInput,
} from '../api';

import { journeyAssetsQueryKeys } from './use-journey-assets';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useAttachJourneyAsset() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    {
      journeyPublicId: string;
      input: AttachJourneyAssetInput;
    }
  >({
    mutationFn: ({ journeyPublicId, input }) =>
      attachJourneyAsset(journeyPublicId, input),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: journeyAssetsQueryKeys.list(
          variables.journeyPublicId,
        ),
      });
    },
  });
}