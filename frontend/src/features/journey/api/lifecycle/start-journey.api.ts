// -----------------------------------------------------------------------------
// sisiMove — Start Journey API
// -----------------------------------------------------------------------------
//
// HTTP adapter for starting a Journey.
//
// Backend endpoint:
//
//   POST /api/v1/journeys/:journeyPublicId/start
//
// Request body:
//
//   {
//     startedAt?: string
//   }
//
// The timestamp is optional. Lifecycle transition rules remain owned by the
// backend Journey aggregate/application layer.
//
// Architectural boundary:
//
//   UI / Hook
//       │
//       ▼
//   startJourney()
//       │
//       ▼
//   AuthenticatedApiClient
//       │
//       ▼
//   POST /journeys/:journeyPublicId/start
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { Journey } from '../../models';

/**
 * Request accepted by the start Journey endpoint.
 */
export interface StartJourneyRequest {
  /**
   * Optional Journey start timestamp.
   *
   * Expected to be an ISO-8601 timestamp when provided.
   */
  startedAt?: string;
}

/**
 * Start a Journey.
 *
 * @param journeyPublicId Public identifier of the Journey.
 * @param request Optional start timestamp.
 * @returns The updated Journey representation.
 */
export async function startJourney(
  journeyPublicId: string,
  request: StartJourneyRequest = {},
): Promise<Journey> {
  return authenticatedApiClient.post<Journey>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/start`,
    request,
  );
}