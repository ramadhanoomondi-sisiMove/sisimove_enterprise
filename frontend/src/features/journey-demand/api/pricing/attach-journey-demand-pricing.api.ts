// -----------------------------------------------------------------------------
// sisiMove — Update Journey Demand Pricing API
// -----------------------------------------------------------------------------
//
// Backend:
//     PUT /journey-demands/:journeyDemandPublicId/pricing
//
// Authentication:
//     Required.
//
// IMPORTANT:
//     The current backend command accepts:
//
//         currency
//         maxFare
//
//     It does NOT currently accept preferredPricePerSeat.
//
//     Therefore the frontend API contract must not invent that field here.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

export interface AttachJourneyDemandPricingInput {
  currency: string;
  maxFare: number;
  correlationId?: string;
  causationId?: string;
}

export async function attachJourneyDemandPricing(
  journeyDemandPublicId: string,
  input: AttachJourneyDemandPricingInput,
): Promise<void> {
  await authenticatedApiClient.put(
    `/journey-demands/${journeyDemandPublicId}/pricing`,
    input,
  );
}