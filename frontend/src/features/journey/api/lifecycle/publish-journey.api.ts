// -----------------------------------------------------------------------------
// sisiMove — Publish Journey API
// -----------------------------------------------------------------------------
//
// HTTP adapter for publishing a Journey.
//
// Backend endpoint:
//
//   POST /api/v1/journeys/:journeyPublicId/publish
//
// Request body:
//
//   {
//     publishedAt?: string
//   }
//
// The timestamp is optional because the backend lifecycle command owns the
// Journey state transition and can determine the effective publication time
// when the caller does not provide one.
//
// Architectural boundary:
//
//   UI / Hook
//       │
//       ▼
//   publishJourney()
//       │
//       ▼
//   AuthenticatedApiClient
//       │
//       ▼
//   POST /journeys/:journeyPublicId/publish
//
// This adapter performs HTTP transport only. Lifecycle rules remain owned by
// the backend Journey aggregate/application layer.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { Journey } from '../../models';

/**
 * Request accepted by the publish Journey endpoint.
 */
export interface PublishJourneyRequest {
  /**
   * Optional publication timestamp.
   *
   * Expected to be an ISO-8601 timestamp when provided.
   */
  publishedAt?: string;
}

/**
 * Publish a Journey.
 *
 * @param journeyPublicId Public identifier of the Journey.
 * @param request Optional publication timestamp.
 * @returns The updated Journey representation.
 */
export async function publishJourney(
  journeyPublicId: string,
  request: PublishJourneyRequest = {},
): Promise<Journey> {
  return authenticatedApiClient.post<Journey>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/publish`,
    request,
  );
}