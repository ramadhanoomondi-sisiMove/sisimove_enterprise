// src/features/journey/api/capacity/remove-journey-capacity.ts

// -----------------------------------------------------------------------------
// sisiMove — Remove Journey Capacity API
// -----------------------------------------------------------------------------
//
// Mirrors:
//
//   DELETE /journeys/:journeyPublicId/capacity
//
// The Journey aggregate owns removal of the capacity and all associated
// invariants.
//
// No request body is required.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";
import type { RequestOptions } from "@/foundation/http";

/**
 * Removes capacity from an existing Journey.
 *
 * Backend:
 *   DELETE /journeys/:journeyPublicId/capacity
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
export async function removeJourneyCapacity(
  journeyPublicId: string,
  options: RequestOptions = {},
): Promise<void> {
  await authenticatedApiClient.delete<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/capacity`,
    options,
  );
}