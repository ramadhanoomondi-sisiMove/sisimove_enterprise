// src/features/journey/api/vehicle/remove-journey-vehicle.ts

// -----------------------------------------------------------------------------
// sisiMove — Remove Journey Vehicle API
// -----------------------------------------------------------------------------
//
// Mirrors:
//
//   DELETE /journeys/:journeyPublicId/vehicle
//
// The Journey aggregate owns removal of the vehicle and all associated
// invariants.
//
// No request body is required. The Journey public identifier identifies the
// Journey whose vehicle is being removed.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";
import type { RequestOptions } from "@/foundation/http";

/**
 * Removes the vehicle from an existing Journey.
 *
 * Backend:
 *   DELETE /journeys/:journeyPublicId/vehicle
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
export async function removeJourneyVehicle(
  journeyPublicId: string,
  options: RequestOptions = {},
): Promise<void> {
  await authenticatedApiClient.delete<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/vehicle`,
    options,
  );
}