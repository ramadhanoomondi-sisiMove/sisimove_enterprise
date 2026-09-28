// src/features/journey/api/schedule/remove-journey-schedule.ts

// -----------------------------------------------------------------------------
// sisiMove — Remove Journey Schedule API
// -----------------------------------------------------------------------------
//
// Mirrors:
//
//   DELETE /journeys/:journeyPublicId/schedule
//
// The Journey aggregate owns removal of the schedule and all associated
// invariants.
//
// No request body is required. The Journey public identifier completely
// identifies the Journey whose schedule is being removed.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";
import type { RequestOptions } from "@/foundation/http";

/**
 * Removes the schedule from an existing Journey.
 *
 * Backend:
 *   DELETE /journeys/:journeyPublicId/schedule
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
export async function removeJourneySchedule(
  journeyPublicId: string,
  options: RequestOptions = {},
): Promise<void> {
  await authenticatedApiClient.delete<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/schedule`,
    options,
  );
}