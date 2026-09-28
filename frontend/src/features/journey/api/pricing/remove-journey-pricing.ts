// src/features/journey/api/pricing/remove-journey-pricing.ts

// -----------------------------------------------------------------------------
// sisiMove — Remove Journey Pricing API
// -----------------------------------------------------------------------------
//
// Mirrors:
//
//   DELETE /journeys/:journeyPublicId/pricing
//
// The Journey aggregate owns removal of pricing and all associated
// invariants.
//
// No request body is required.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";
import type { RequestOptions } from "@/foundation/http";

/**
 * Removes pricing from an existing Journey.
 *
 * Backend:
 *   DELETE /journeys/:journeyPublicId/pricing
 *
 * Request body:
 *   none
 *
 * Response:
 *   no response body
 *
 * The resulting Journey state should be obtained through the canonical
 * authenticated Journey query rather than fabricated locally.
 */
export async function removeJourneyPricing(
  journeyPublicId: string,
  options: RequestOptions = {},
): Promise<void> {
  await authenticatedApiClient.delete<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/pricing`,
    options,
  );
}