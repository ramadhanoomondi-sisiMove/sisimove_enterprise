// -----------------------------------------------------------------------------
// sisiMove — Update Journey Demand Capacity API
// -----------------------------------------------------------------------------
//
// Backend:
//     PUT /journey-demands/:journeyDemandPublicId/capacity
//
// Authentication:
//     Required.
//
// Backend field:
//     seatsRequired
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { JourneyDemandCapacityInput } from '../../schemas';

export async function attachJourneyDemandCapacity(
  journeyDemandPublicId: string,
  input: JourneyDemandCapacityInput,
): Promise<void> {
  await authenticatedApiClient.put(
    `/journey-demands/${journeyDemandPublicId}/capacity`,
    input,
  );
}