// -----------------------------------------------------------------------------
// sisiMove — Complete Journey API
// -----------------------------------------------------------------------------
//
// HTTP adapter for completing a Journey.
//
// Backend endpoint:
//
//   POST /api/v1/journeys/:journeyPublicId/complete
//
// Request body:
//
//   {
//     completedAt?: string
//   }
//
// The timestamp is optional. Completion rules and lifecycle invariants remain
// owned by the backend Journey aggregate/application layer.
//
// Architectural boundary:
//
//   UI / Hook
//       │
//       ▼
//   completeJourney()
//       │
//       ▼
//   AuthenticatedApiClient
//       │
//       ▼
//   POST /journeys/:journeyPublicId/complete
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { Journey } from '../../models';

/**
 * Request accepted by the complete Journey endpoint.
 */
export interface CompleteJourneyRequest {
  /**
   * Optional Journey completion timestamp.
   *
   * Expected to be an ISO-8601 timestamp when provided.
   */
  completedAt?: string;
}

/**
 * Complete a Journey.
 *
 * @param journeyPublicId Public identifier of the Journey.
 * @param request Optional completion timestamp.
 * @returns The updated Journey representation.
 */
export async function completeJourney(
  journeyPublicId: string,
  request: CompleteJourneyRequest = {},
): Promise<Journey> {
  return authenticatedApiClient.post<Journey>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/complete`,
    request,
  );
}