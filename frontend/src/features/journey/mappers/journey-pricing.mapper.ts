// -----------------------------------------------------------------------------
// sisiMove — Journey Pricing Mapper
// -----------------------------------------------------------------------------
//
// Maps the raw Journey pricing API representation into the stable frontend
// JourneyPricing model.
//
// Architectural boundary:
//
//   HTTP API response
//       │
//       ▼
//   mapJourneyPricing()
//       │
//       ▼
//   JourneyPricing model
//       │
//       ▼
//   Hooks / Components
//
// Monetary values are intentionally kept as integer minor units.
//
// The mapper does NOT:
//
// - convert minor units into display currency values;
// - format currency strings;
// - round monetary amounts;
// - perform currency conversion;
// - apply fees, commissions, or discounts.
//
// Those concerns belong to the appropriate presentation or financial
// application layer.
//
// -----------------------------------------------------------------------------

import type { JourneyPricing } from '../models';

/**
 * Raw Journey pricing representation returned by the HTTP API.
 */
export interface JourneyPricingApiResponse {
  /**
   * Public identifier of the pricing configuration.
   */
  publicId: string;

  /**
   * Journey price in the currency's minor unit.
   */
  amount: number;

  /**
   * ISO 4217 currency code.
   */
  currency: string;

  /**
   * Creation timestamp, when provided.
   */
  createdAt?: string;

  /**
   * Last update timestamp, when provided.
   */
  updatedAt?: string;
}

/**
 * Map a raw Journey pricing API representation into the frontend model.
 *
 * @param pricing Raw pricing representation returned by the Journey API.
 * @returns Stable frontend JourneyPricing model.
 */
export function mapJourneyPricing(
  pricing: JourneyPricingApiResponse,
): JourneyPricing {
  return {
    publicId: pricing.publicId,
    amount: pricing.amount,
    currency: pricing.currency,
    createdAt: pricing.createdAt,
    updatedAt: pricing.updatedAt,
  };
}