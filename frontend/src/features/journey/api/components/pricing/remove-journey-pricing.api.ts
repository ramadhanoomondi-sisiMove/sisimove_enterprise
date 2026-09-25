// -----------------------------------------------------------------------------
// sisiMove — Remove Journey Pricing API
// -----------------------------------------------------------------------------
//
// HTTP adapter for removing the pricing configuration attached to a Journey.
//
// Backend endpoint:
//
//   DELETE /api/v1/journeys/:journeyPublicId/pricing
//
// No request body is required.
//
// Architectural boundary:
//
//   UI / Hook
//       │
//       ▼
//   removeJourneyPricing()
//       │
//       ▼
//   AuthenticatedApiClient
//       │
//       ▼
//   DELETE /journeys/:journeyPublicId/pricing
//
// The backend owns validation, lifecycle rules, and the invariants governing
// removal of the Journey pricing association.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

/**
 * Remove the pricing configuration attached to a Journey.
 *
 * @param journeyPublicId Public identifier of the Journey.
 *
 * The endpoint does not require a request body. The backend identifies the
 * pricing configuration through the Journey and removes the existing
 * attachment.
 */
export async function removeJourneyPricing(
  journeyPublicId: string,
): Promise<void> {
  await authenticatedApiClient.delete<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/pricing`,
  );
}