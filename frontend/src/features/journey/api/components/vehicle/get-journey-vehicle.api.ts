// -----------------------------------------------------------------------------
// sisiMove — Get Journey Vehicle API
// -----------------------------------------------------------------------------
//
// HTTP adapter for retrieving the vehicle attached to a Journey.
//
// Backend endpoint:
//
//   GET /api/v1/journeys/:journeyPublicId/vehicle
//
// Architectural boundary:
//
//   UI / Hook
//       │
//       ▼
//   getJourneyVehicle()
//       │
//       ▼
//   AuthenticatedApiClient
//       │
//       ▼
//   GET /journeys/:journeyPublicId/vehicle
//
// The adapter performs HTTP transport only. Mapping and presentation concerns
// remain outside this layer.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { JourneyVehicle } from '../../../models';

/**
 * Get the vehicle attached to a Journey.
 *
 * @param journeyPublicId Public identifier of the Journey.
 * @returns The attached Journey vehicle, or null when none is attached.
 */
export async function getJourneyVehicle(
  journeyPublicId: string,
): Promise<JourneyVehicle | null> {
  return authenticatedApiClient.get<JourneyVehicle | null>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/vehicle`,
  );
}