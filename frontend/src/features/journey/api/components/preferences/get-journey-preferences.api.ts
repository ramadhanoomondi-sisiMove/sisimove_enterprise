// -----------------------------------------------------------------------------
// sisiMove — Get Journey Preferences API
// -----------------------------------------------------------------------------
//
// HTTP adapter for retrieving the preferences configuration attached to a
// Journey.
//
// Backend endpoint:
//
//   GET /api/v1/journeys/:journeyPublicId/preferences
//
// Architectural boundary:
//
//   UI / Hook
//       │
//       ▼
//   getJourneyPreferences()
//       │
//       ▼
//   AuthenticatedApiClient
//       │
//       ▼
//   GET /journeys/:journeyPublicId/preferences
//
// The adapter performs HTTP transport only. Mapping and presentation concerns
// remain outside this layer.
//
// The returned preferences describe the Journey's configured travel
// environment and policies. They do not represent the authenticated user's
// personal preferences.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { JourneyPreferences } from '../../../models';

/**
 * Get the preferences configuration attached to a Journey.
 *
 * @param journeyPublicId Public identifier of the Journey.
 * @returns The attached Journey preferences, or null when none is attached.
 */
export async function getJourneyPreferences(
  journeyPublicId: string,
): Promise<JourneyPreferences | null> {
  return authenticatedApiClient.get<JourneyPreferences | null>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/preferences`,
  );
}