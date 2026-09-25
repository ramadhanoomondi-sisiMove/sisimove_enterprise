// -----------------------------------------------------------------------------
// sisiMove — Remove Journey Vehicle API
// -----------------------------------------------------------------------------
//
// HTTP adapter for removing the vehicle attached to a Journey.
//
// Backend endpoint:
//
//   DELETE /api/v1/journeys/:journeyPublicId/vehicle
//
// No request body is required.
//
// Architectural boundary:
//
//   UI / Hook
//       │
//       ▼
//   removeJourneyVehicle()
//       │
//       ▼
//   AuthenticatedApiClient
//       │
//       ▼
//   DELETE /journeys/:journeyPublicId/vehicle
//
// The backend owns validation, lifecycle rules, and the invariants governing
// removal of the Journey vehicle association.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

/**
 * Remove the vehicle attached to a Journey.
 *
 * @param journeyPublicId Public identifier of the Journey.
 *
 * The endpoint does not require a request body. The backend identifies the
 * vehicle through the Journey and removes the existing attachment.
 */
export async function removeJourneyVehicle(
  journeyPublicId: string,
): Promise<void> {
  await authenticatedApiClient.delete<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/vehicle`,
  );
}