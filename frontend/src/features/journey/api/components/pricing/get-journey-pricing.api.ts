// -----------------------------------------------------------------------------
// sisiMove — Get Journey Pricing API
// -----------------------------------------------------------------------------
//
// HTTP adapter for retrieving the pricing configuration attached to a Journey.
//
// Backend endpoint:
//
//   GET /api/v1/journeys/:journeyPublicId/pricing
//
// Architectural boundary:
//
//   UI / Hook
//       │
//       ▼
//   getJourneyPricing()
//       │
//       ▼
//   AuthenticatedApiClient
//       │
//       ▼
//   GET /journeys/:journeyPublicId/pricing
//
// The adapter performs HTTP transport only. Mapping and presentation concerns
// remain outside this layer.
//
// Monetary values are returned according to the Journey API's pricing model.
// The adapter does not convert, round, or otherwise reinterpret the amount.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { JourneyPricing } from '../../../models';

/**
 * Get the pricing configuration attached to a Journey.
 *
 * @param journeyPublicId Public identifier of the Journey.
 * @returns The attached Journey pricing, or null when none is attached.
 */
export async function getJourneyPricing(
  journeyPublicId: string,
): Promise<JourneyPricing | null> {
  return authenticatedApiClient.get<JourneyPricing | null>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/pricing`,
  );
}