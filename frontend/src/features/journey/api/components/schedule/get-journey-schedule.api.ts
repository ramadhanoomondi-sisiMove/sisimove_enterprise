// -----------------------------------------------------------------------------
// sisiMove — Get Journey Schedule API
// -----------------------------------------------------------------------------
//
// HTTP adapter for retrieving the schedule attached to a Journey.
//
// Backend endpoint:
//
//   GET /api/v1/journeys/:journeyPublicId/schedule
//
// Architectural boundary:
//
//   UI / Hook
//       │
//       ▼
//   getJourneySchedule()
//       │
//       ▼
//   AuthenticatedApiClient
//       │
//       ▼
//   GET /journeys/:journeyPublicId/schedule
//
// The adapter performs HTTP transport only. Mapping and presentation concerns
// remain outside this layer.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { JourneySchedule } from '../../../models';

/**
 * Get the schedule attached to a Journey.
 *
 * @param journeyPublicId Public identifier of the Journey.
 * @returns The attached Journey schedule, or null when none is attached.
 */
export async function getJourneySchedule(
  journeyPublicId: string,
): Promise<JourneySchedule | null> {
  return authenticatedApiClient.get<JourneySchedule | null>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/schedule`,
  );
}