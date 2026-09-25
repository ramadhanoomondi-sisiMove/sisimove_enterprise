// -----------------------------------------------------------------------------
// sisiMove — Get Journey Demand Participants API
// -----------------------------------------------------------------------------
//
// Backend:
//     GET /journey-demands/:journeyDemandPublicId/participants
//
// Authentication:
//     Required.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { JourneyDemandParticipant } from '../../models';

export async function getJourneyDemandParticipants(
  journeyDemandPublicId: string,
): Promise<JourneyDemandParticipant[]> {
  return authenticatedApiClient.get<JourneyDemandParticipant[]>(
    `/journey-demands/${journeyDemandPublicId}/participants`,
  );
}