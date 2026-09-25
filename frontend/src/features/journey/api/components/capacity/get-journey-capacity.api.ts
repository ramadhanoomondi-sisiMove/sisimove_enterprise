// -----------------------------------------------------------------------------
// sisiMove — Get Journey Capacity API
// -----------------------------------------------------------------------------
//
// HTTP adapter for retrieving the capacity attached to a Journey.
//
// Backend endpoint:
//
//   GET /api/v1/journeys/:journeyPublicId/capacity
//
// Architectural boundary:
//
//   UI / Hook
//       │
//       ▼
//   getJourneyCapacity()
//       │
//       ▼
//   AuthenticatedApiClient
//       │
//       ▼
//   GET /journeys/:journeyPublicId/capacity
//
// The adapter performs HTTP transport only. Mapping and presentation concerns
// remain outside this layer.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { JourneyCapacity } from '../../../models';

/**
 * Get the capacity attached to a Journey.
 *
 * @param journeyPublicId Public identifier of the Journey.
 * @returns The attached Journey capacity, or null when none is attached.
 */
export async function getJourneyCapacity(
  journeyPublicId: string,
): Promise<JourneyCapacity | null> {
  return authenticatedApiClient.get<JourneyCapacity | null>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/capacity`,
  );
}