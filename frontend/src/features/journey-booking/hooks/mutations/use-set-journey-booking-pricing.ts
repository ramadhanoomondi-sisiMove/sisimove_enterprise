// frontend/src/features/journey-booking/hooks/use-set-journey-booking-pricing.ts

import { useMutation } from '@tanstack/react-query';

import {
  setJourneyBookingPricing,
  type SetJourneyBookingPricingRequest,
  type SetJourneyBookingPricingResponse,
} from '../../api';

export interface SetJourneyBookingPricingVariables {
  journeyBookingPublicId: string;
  request: SetJourneyBookingPricingRequest;
}

export function useSetJourneyBookingPricing() {
  return useMutation<
    SetJourneyBookingPricingResponse,
    Error,
    SetJourneyBookingPricingVariables
  >({
    mutationFn: ({
      journeyBookingPublicId,
      request,
    }) =>
      setJourneyBookingPricing(
        journeyBookingPublicId,
        request,
      ),
  });
}