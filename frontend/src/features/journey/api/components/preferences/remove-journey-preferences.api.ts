// -----------------------------------------------------------------------------
// sisiMove — Remove Journey Preferences API
// -----------------------------------------------------------------------------
//
// HTTP adapter for removing the preferences configuration attached to a
// Journey.
//
// Backend endpoint:
//
//   DELETE /api/v1/journeys/:journeyPublicId/preferences
//
// No request body is required.
//
// Architectural boundary:
//
//   UI / Hook
//       │
//       ▼
//   removeJourneyPreferences()
//       │
//       ▼
//   AuthenticatedApiClient
//       │
//       ▼
//   DELETE /journeys/:journeyPublicId/preferences
//
// The backend owns validation, lifecycle rules, and the invariants governing
// removal of the Journey preferences association.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

/**
 * Remove the preferences configuration attached to a Journey.
 *
 * @param journeyPublicId Public identifier of the Journey.
 *
 * The endpoint does not require a request body. The backend identifies the
 * preferences configuration through the Journey and removes the existing
 * attachment.
 */
export async function removeJourneyPreferences(
  journeyPublicId: string,
): Promise<void> {
  await authenticatedApiClient.delete<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/preferences`,
  );
}