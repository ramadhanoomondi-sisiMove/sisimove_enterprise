// -----------------------------------------------------------------------------
// sisiMove — Update Journey Demand Corridor API
// -----------------------------------------------------------------------------
//
// Backend:
//     PUT /journey-demands/:journeyDemandPublicId/corridor
//
// The backend calls this operation "update" rather than "attach". The
// frontend feature structure uses "attach" because the operation establishes
// the corridor component for a Journey Demand.
//
// Authentication:
//     Required.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { JourneyDemandRouteInput } from '../../schemas';

export async function attachJourneyDemandCorridor(
  journeyDemandPublicId: string,
  input: JourneyDemandRouteInput,
): Promise<void> {
  await authenticatedApiClient.put(
    `/journey-demands/${journeyDemandPublicId}/corridor`,
    input,
  );
}