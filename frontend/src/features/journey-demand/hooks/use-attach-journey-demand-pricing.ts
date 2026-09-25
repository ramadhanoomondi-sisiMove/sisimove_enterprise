// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Demand Pricing Hook
// -----------------------------------------------------------------------------

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  attachJourneyDemandPricing,
} from '../api/pricing/attach-journey-demand-pricing.api';

import type {
  JourneyDemandPricingInput,
} from '../schemas';

import {
  JOURNEY_DEMAND_PRICING_QUERY_KEY,
} from './use-journey-demand-pricing';

export function useAttachJourneyDemandPricing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      journeyDemandPublicId,
      input,
    }: {
      journeyDemandPublicId: string;
      input: JourneyDemandPricingInput;
    }) =>
      attachJourneyDemandPricing(
        journeyDemandPublicId,
        input,
      ),

    onSuccess: async (
      _data,
      variables,
    ) => {
      await queryClient.invalidateQueries({
        queryKey: [
          ...JOURNEY_DEMAND_PRICING_QUERY_KEY,
          variables.journeyDemandPublicId,
        ],
      });
    },
  });
}