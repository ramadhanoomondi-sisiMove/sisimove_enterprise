// src/features/journey/api/preferences/remove-journey-preferences.ts

// -----------------------------------------------------------------------------
// sisiMove — Remove Journey Preferences API
// -----------------------------------------------------------------------------
//
// Mirrors:
//
//   DELETE /journeys/:journeyPublicId/preferences
//
// The Journey aggregate owns removal of the preferences component and all
// associated domain invariants.
//
// No request body is required.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";
import type { RequestOptions } from "@/foundation/http";

/**
 * Removes preferences from an existing Journey.
 *
 * Backend:
 *   DELETE /journeys/:journeyPublicId/preferences
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
export async function removeJourneyPreferences(
  journeyPublicId: string,
  options: RequestOptions = {},
): Promise<void> {
  await authenticatedApiClient.delete<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/preferences`,
    options,
  );
}