// -----------------------------------------------------------------------------
// sisiMove — Get Journey API
// -----------------------------------------------------------------------------
//
// Retrieves a publicly discoverable Journey by public ID.
//
// Backend:
//     GET /journeys/:journeyPublicId
//
// Authentication:
//     Not required.
//
// IMPORTANT:
//     The backend public endpoint returns the public marketplace projection,
//     not the internal Journey aggregate.
//
// Therefore this API adapter should eventually return PublicJourney rather
// than the authenticated/internal Journey model.
//
// -----------------------------------------------------------------------------

import { apiClient } from '@/foundation/http';

import type { Journey } from '../../journey/models';

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export async function getJourney(
  journeyPublicId: string,
): Promise<Journey | null> {
  return apiClient.get<Journey | null>(
    `/journeys/${encodeURIComponent(journeyPublicId)}`,
  );
}