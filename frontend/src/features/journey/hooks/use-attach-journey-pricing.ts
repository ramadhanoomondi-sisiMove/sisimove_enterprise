// -----------------------------------------------------------------------------
// sisiMove — useAttachJourneyPricing
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  attachJourneyPricing,
  type AttachJourneyPricingInput,
} from '../api';

import { journeyPricingQueryKeys } from './use-journey-pricing';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useAttachJourneyPricing() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    {
      journeyPublicId: string;
      input: AttachJourneyPricingInput;
    }
  >({
    mutationFn: ({ journeyPublicId, input }) =>
      attachJourneyPricing(journeyPublicId, input),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: journeyPricingQueryKeys.detail(
          variables.journeyPublicId,
        ),
      });
    },
  });
}