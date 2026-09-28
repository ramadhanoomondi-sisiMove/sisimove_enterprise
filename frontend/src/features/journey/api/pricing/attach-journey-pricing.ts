// src/features/journey/api/pricing/attach-journey-pricing.ts

// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Pricing API
// -----------------------------------------------------------------------------
//
// Mirrors:
//
//   POST /journeys/:journeyPublicId/pricing
//
// The backend application layer:
// - receives primitive pricing configuration;
// - converts values at the application/domain boundary;
// - creates the JourneyPricingEntity;
// - asks the Journey aggregate to attach/orchestrate pricing;
// - enforces aggregate invariants;
// - persists the aggregate.
//
// The frontend therefore submits only the pricing configuration accepted by
// the HTTP endpoint.
//
// The backend generates the pricing public identifier.
// The frontend does not generate or submit it.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";
import type { RequestOptions } from "@/foundation/http";

/**
 * HTTP input required to attach pricing to a Journey.
 *
 * `amount` represents the configured Journey price.
 * `currency` identifies the currency used for that price.
 */
export interface AttachJourneyPricingRequest {
  readonly amount: number;
  readonly currency: string;
}

/**
 * Attaches pricing to an existing Journey.
 *
 * Backend:
 *   POST /journeys/:journeyPublicId/pricing
 *
 * Request body:
 *   {
 *     amount: number;
 *     currency: string;
 *   }
 *
 * Response:
 *   no response body
 *
 * The resulting Journey pricing state should be obtained through the
 * canonical authenticated Journey query rather than fabricated locally.
 */
export async function attachJourneyPricing(
  journeyPublicId: string,
  request: AttachJourneyPricingRequest,
  options: RequestOptions = {},
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/pricing`,
    request,
    options,
  );
}