// src/features/journey/api/corridor/remove-journey-corridor.ts

// -----------------------------------------------------------------------------
// sisiMove — Remove Journey Corridor API
// -----------------------------------------------------------------------------
//
// Mirrors:
//
//   DELETE /journeys/:journeyPublicId/corridor
//
// The Journey aggregate owns removal of the corridor and its invariants.
// The frontend only identifies the Journey whose corridor should be removed.
//
// No request body is sent because the backend endpoint identifies the
// resource entirely through the Journey public identifier.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";
import type { RequestOptions } from "@/foundation/http";

/**
 * Removes the corridor from an existing Journey.
 *
 * Backend:
 *   DELETE /journeys/:journeyPublicId/corridor
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
export async function removeJourneyCorridor(
  journeyPublicId: string,
  options: RequestOptions = {},
): Promise<void> {
  await authenticatedApiClient.delete<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/corridor`,
    options,
  );
}