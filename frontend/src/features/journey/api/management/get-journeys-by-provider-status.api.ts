// -----------------------------------------------------------------------------
// sisiMove — Get Journeys By Provider And Status API
// -----------------------------------------------------------------------------
//
// HTTP adapter for retrieving a provider's Journeys filtered by lifecycle
// status.
//
// Backend endpoint:
//
//   GET /api/v1/journeys/provider/:providerPublicId/status/:status
//
// Architectural boundary:
//
//   UI / Hook
//       │
//       ▼
//   getJourneysByProviderStatus()
//       │
//       ▼
//   AuthenticatedApiClient
//       │
//       ▼
//   GET /journeys/provider/:providerPublicId/status/:status
//
// The provider public ID is explicitly supplied because this endpoint is
// different from the authenticated `/journeys/me` endpoint.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { Journey, JourneyStatus } from '../../models';

/**
 * Fetch Journeys belonging to a provider and matching a lifecycle status.
 *
 * Maps directly to:
 *
 *   GET /journeys/provider/:providerPublicId/status/:status
 *
 * @param providerPublicId Public identifier of the provider.
 * @param status Journey lifecycle status used by the backend filter.
 * @returns Journeys belonging to the provider with the requested status.
 */
export async function getJourneysByProviderStatus(
  providerPublicId: string,
  status: JourneyStatus,
): Promise<Journey[]> {
  return authenticatedApiClient.get<Journey[]>(
    `/journeys/provider/${encodeURIComponent(providerPublicId)}/status/${encodeURIComponent(status)}`,
  );
}