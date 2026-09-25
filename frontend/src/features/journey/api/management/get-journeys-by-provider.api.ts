// -----------------------------------------------------------------------------
// sisiMove — Get Journeys By Provider API
// -----------------------------------------------------------------------------
//
// HTTP adapter for retrieving Journeys belonging to a specific provider.
//
// Backend endpoint:
//
//   GET /api/v1/journeys/provider/:providerPublicId
//
// This is an authenticated management endpoint. The provider public ID is
// supplied explicitly because this endpoint is distinct from `/journeys/me`.
//
// Architectural boundary:
//
//   UI / Hook
//       │
//       ▼
//   getJourneysByProvider()
//       │
//       ▼
//   AuthenticatedApiClient
//       │
//       ▼
//   GET /journeys/provider/:providerPublicId
//
// The adapter performs HTTP transport only. Response transformation belongs
// to the Journey mappers layer.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { Journey } from '../../models';

/**
 * Fetch Journeys belonging to a provider.
 *
 * Maps directly to:
 *
 *   GET /journeys/provider/:providerPublicId
 *
 * @param providerPublicId Public identifier of the provider.
 * @returns Journeys associated with the specified provider.
 */
export async function getJourneysByProvider(
  providerPublicId: string,
): Promise<Journey[]> {
  return authenticatedApiClient.get<Journey[]>(
    `/journeys/provider/${encodeURIComponent(providerPublicId)}`,
  );
}