// -----------------------------------------------------------------------------
// sisiMove — Remove Journey Capacity API
// -----------------------------------------------------------------------------
//
// HTTP adapter for removing the capacity attached to a Journey.
//
// Backend endpoint:
//
//   DELETE /api/v1/journeys/:journeyPublicId/capacity
//
// No request body is required.
//
// Architectural boundary:
//
//   UI / Hook
//       │
//       ▼
//   removeJourneyCapacity()
//       │
//       ▼
//   AuthenticatedApiClient
//       │
//       ▼
//   DELETE /journeys/:journeyPublicId/capacity
//
// The backend owns validation, lifecycle rules, and the invariants governing
// removal of the Journey capacity association.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

/**
 * Remove the capacity attached to a Journey.
 *
 * @param journeyPublicId Public identifier of the Journey.
 *
 * The endpoint does not require a request body. The backend identifies the
 * capacity through the Journey and removes the existing attachment.
 */
export async function removeJourneyCapacity(
  journeyPublicId: string,
): Promise<void> {
  await authenticatedApiClient.delete<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/capacity`,
  );
}