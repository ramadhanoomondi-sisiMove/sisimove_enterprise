// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Pricing Mapper
// -----------------------------------------------------------------------------
//
// Maps the backend JourneyDemandPricingResponse contract into the frontend
// JourneyDemandPricing model.
//
// Nullable backend prices are normalized to `undefined`, because the frontend
// application model uses `undefined` to represent an absent optional value.
//
// Pricing interpretation remains backend-owned.
// -----------------------------------------------------------------------------

import type { JourneyDemandPricing } from '../models/journey-demand-pricing';

/**
 * Backend HTTP/application response consumed by this mapper.
 */
export interface JourneyDemandPricingResponse {
  readonly publicId: string;

  readonly maximumPricePerSeat: number | null;
  readonly preferredPricePerSeat: number | null;

  readonly currency: string;

  readonly hasMaximumPrice: boolean;
  readonly hasPreferredPrice: boolean;
  readonly hasPriceConstraint: boolean;
  readonly hasMaximumPriceConstraint: boolean;
  readonly hasPreferredPriceConstraint: boolean;

  readonly isUnconstrained: boolean;
  readonly isPreferredPriceOnly: boolean;
  readonly isMaximumPriceOnly: boolean;
  readonly hasPreferredAndMaximumPrice: boolean;

  readonly createdAt: string | Date;
  readonly updatedAt: string | Date;
}

/**
 * Maps one backend Journey Demand pricing response.
 */
export function mapJourneyDemandPricing(
  response: JourneyDemandPricingResponse,
): JourneyDemandPricing {
  return {
    publicId: response.publicId,

    maximumPricePerSeat:
      response.maximumPricePerSeat ?? undefined,

    preferredPricePerSeat:
      response.preferredPricePerSeat ?? undefined,

    currency: response.currency,

    // Backend-provided pricing state.
    hasMaximumPrice: response.hasMaximumPrice,
    hasPreferredPrice: response.hasPreferredPrice,
    hasPriceConstraint: response.hasPriceConstraint,
    hasMaximumPriceConstraint: response.hasMaximumPriceConstraint,
    hasPreferredPriceConstraint: response.hasPreferredPriceConstraint,

    isUnconstrained: response.isUnconstrained,
    isPreferredPriceOnly: response.isPreferredPriceOnly,
    isMaximumPriceOnly: response.isMaximumPriceOnly,
    hasPreferredAndMaximumPrice:
      response.hasPreferredAndMaximumPrice,

    createdAt: new Date(response.createdAt),
    updatedAt: new Date(response.updatedAt),
  };
}