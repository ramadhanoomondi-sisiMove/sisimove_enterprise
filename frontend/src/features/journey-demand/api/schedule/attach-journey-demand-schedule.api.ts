// -----------------------------------------------------------------------------
// sisiMove — Update Journey Demand Schedule API
// -----------------------------------------------------------------------------
//
// Backend:
//     PUT /journey-demands/:journeyDemandPublicId/schedule
//
// Authentication:
//     Required.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { JourneyDemandScheduleInput } from '../../schemas';

export async function attachJourneyDemandSchedule(
  journeyDemandPublicId: string,
  input: JourneyDemandScheduleInput,
): Promise<void> {
  await authenticatedApiClient.put(
    `/journey-demands/${journeyDemandPublicId}/schedule`,
    input,
  );
}