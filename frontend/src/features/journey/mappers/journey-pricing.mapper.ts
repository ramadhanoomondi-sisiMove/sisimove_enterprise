// -----------------------------------------------------------------------------
// sisiMove — Journey Pricing Mapper
// -----------------------------------------------------------------------------

import type { JourneyPricing } from "../models/journey-pricing";

export interface JourneyPricingResponse {
  readonly publicId: string;
  readonly amount: number;
  readonly currency: string;
}

export const JourneyPricingMapper = {
  fromResponse(response: JourneyPricingResponse): JourneyPricing {
    return {
      publicId: response.publicId,
      amount: response.amount,
      currency: response.currency,
    };
  },
};