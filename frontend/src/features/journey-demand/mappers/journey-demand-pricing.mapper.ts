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
//
// IMPORTANT:
// The current frontend model still exposes these backend interpretation flags:
//
// - hasPriceConstraint
// - hasMaximumPriceConstraint
// - hasMaximumPrice
// - isMaximumPriceOnly
// - isUnconstrained
//
// The former preferred-price fields are no longer part of the frontend model
// and must not be reintroduced here.
// -----------------------------------------------------------------------------

import type { JourneyDemandPricing } from '../models/journey-demand-pricing';

// -----------------------------------------------------------------------------
// Backend response contract
// -----------------------------------------------------------------------------

/**
 * Backend HTTP/application response consumed by this mapper.
 */
export interface JourneyDemandPricingResponse {
  readonly publicId: string;

  readonly maximumPricePerSeat: number | null;

  readonly currency: string;

  // ---------------------------------------------------------------------------
  // Backend-owned pricing interpretation.
  // ---------------------------------------------------------------------------

  readonly hasPriceConstraint: boolean;
  readonly hasMaximumPriceConstraint: boolean;
  readonly hasMaximumPrice: boolean;

  readonly isUnconstrained: boolean;
  readonly isMaximumPriceOnly: boolean;

  readonly createdAt: string | Date;
  readonly updatedAt: string | Date;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

/**
 * Maps one backend Journey Demand pricing response.
 *
 * This mapper does not calculate pricing state.
 *
 * The backend remains authoritative for:
 * - whether a price constraint exists;
 * - whether the constraint is a maximum-price constraint;
 * - whether the demand is unconstrained;
 * - how the supplied maximum price should be interpreted.
 */
export function mapJourneyDemandPricing(
  response: JourneyDemandPricingResponse,
): JourneyDemandPricing {
  return {
    publicId: response.publicId,

    maximumPricePerSeat:
      response.maximumPricePerSeat ?? undefined,

    currency: response.currency,

    // -------------------------------------------------------------------------
    // Backend-provided pricing interpretation.
    // -------------------------------------------------------------------------

    hasPriceConstraint:
      response.hasPriceConstraint,

    hasMaximumPriceConstraint:
      response.hasMaximumPriceConstraint,

    hasMaximumPrice:
      response.hasMaximumPrice,

    isUnconstrained:
      response.isUnconstrained,

    isMaximumPriceOnly:
      response.isMaximumPriceOnly,

    // -------------------------------------------------------------------------
    // Backend timestamps.
    // -------------------------------------------------------------------------

    createdAt: new Date(response.createdAt),
    updatedAt: new Date(response.updatedAt),
  };
}