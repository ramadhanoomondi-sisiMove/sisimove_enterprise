// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Pricing API
// -----------------------------------------------------------------------------
//
// HTTP adapter for updating Journey Demand pricing.
//
// Backend endpoint:
//
//   PUT /journey-demands/:journeyDemandPublicId/pricing
//
// Backend request:
//
//   UpdateJourneyDemandPricingDto
//
// Backend response:
//
//   void
//
// The backend mutation currently accepts `maxFare` and `currency` only.
// The frontend must not invent a preferred-price mutation merely because the
// public read model may contain preferred pricing information.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

// -----------------------------------------------------------------------------
// Request
// -----------------------------------------------------------------------------

/**
 * Request payload for updating Journey Demand pricing.
 *
 * This mirrors the currently implemented backend DTO exactly.
 */
export interface UpdateJourneyDemandPricingRequest {
  /**
   * Maximum fare per seat accepted by the requester.
   */
  readonly maxFare: number;

  /**
   * ISO-style currency code used by the demand.
   */
  readonly currency: string;

  /**
   * Correlation identifier for distributed tracing.
   */
  readonly correlationId: string;

  /**
   * Optional causation identifier for distributed tracing.
   */
  readonly causationId?: string;
}

// -----------------------------------------------------------------------------
// Endpoint
// -----------------------------------------------------------------------------

const JOURNEY_DEMANDS_PATH = '/journey-demands';

// -----------------------------------------------------------------------------
// Mutation
// -----------------------------------------------------------------------------

/**
 * Update Journey Demand pricing.
 *
 * The backend owns monetary validation and pricing state changes.
 */
export async function updateJourneyDemandPricing(
  journeyDemandPublicId: string,
  request: UpdateJourneyDemandPricingRequest,
): Promise<void> {
  await authenticatedApiClient.put<void>(
    `${JOURNEY_DEMANDS_PATH}/${encodeURIComponent(journeyDemandPublicId)}/pricing`,
    request,
  );
}