// -----------------------------------------------------------------------------
// sisiMove — Get Public Journey API
// -----------------------------------------------------------------------------
//
// Retrieves one publicly discoverable Journey by its public identifier.
//
// Backend endpoint:
//
//     GET /api/v1/journeys/:journeyPublicId
//
// Backend architecture:
//
//     GET /journeys/:journeyPublicId
//              │
//              ▼
//     GetPublicJourneysQuery
//              │
//              ▼
//     PublicJourneyResponse | null
//
// Important:
//
// The backend intentionally resolves Journey detail through the plural
// GetPublicJourneysQuery. The frontend adapter may expose a singular
// getJourney() operation because the HTTP endpoint represents a single
// resource, but it must not imply the existence of a singular backend query.
//
// Architectural boundary:
//
// - Uses the public foundation `apiClient`.
// - Represents the Journey HTTP discovery boundary.
// - Does NOT contain React Query concerns.
// - Does NOT perform lifecycle mutations.
// - Does NOT expose providerPublicId beyond the backend's actual response
//   contract.
// - Does NOT reconstruct Traveller, Trust, Asset, or other cross-domain data.
// - Does NOT access authentication session storage.
//
// The foundation ApiClient already unwraps standardized `{ data: ... }`
// responses, so this adapter receives the actual typed response directly.
//
// -----------------------------------------------------------------------------

import { apiClient } from '@/foundation/http';

import type { Journey } from '@/features/journey/models/journey';

/**
 * Retrieve one publicly discoverable Journey.
 *
 * The backend returns `null` when the requested public Journey does not
 * resolve to a discoverable resource.
 */
export async function getJourney(
  journeyPublicId: string,
): Promise<Journey | null> {
  return apiClient.get<Journey | null>(
    `/journeys/${encodeURIComponent(journeyPublicId)}`,
  );
}