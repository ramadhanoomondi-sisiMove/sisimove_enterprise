// -----------------------------------------------------------------------------
// sisiMove — Expire Journey API
// -----------------------------------------------------------------------------
//
// HTTP adapter for expiring a Journey.
//
// Backend endpoint:
//
//   POST /api/v1/journeys/:journeyPublicId/expire
//
// Request body:
//
//   {
//     expiredAt?: string
//   }
//
// The timestamp is optional. Expiration rules and lifecycle invariants remain
// owned by the backend Journey aggregate/application layer.
//
// Architectural boundary:
//
//   UI / Hook
//       │
//       ▼
//   expireJourney()
//       │
//       ▼
//   AuthenticatedApiClient
//       │
//       ▼
//   POST /journeys/:journeyPublicId/expire
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { Journey } from '../../models';

/**
 * Request accepted by the expire Journey endpoint.
 */
export interface ExpireJourneyRequest {
  /**
   * Optional Journey expiration timestamp.
   *
   * Expected to be an ISO-8601 timestamp when provided.
   */
  expiredAt?: string;
}

/**
 * Expire a Journey.
 *
 * @param journeyPublicId Public identifier of the Journey.
 * @param request Optional expiration timestamp.
 * @returns The updated Journey representation.
 */
export async function expireJourney(
  journeyPublicId: string,
  request: ExpireJourneyRequest = {},
): Promise<Journey> {
  return authenticatedApiClient.post<Journey>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/expire`,
    request,
  );
}