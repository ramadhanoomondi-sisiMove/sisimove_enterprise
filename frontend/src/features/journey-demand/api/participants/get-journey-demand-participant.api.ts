// -----------------------------------------------------------------------------
// sisiMove — Get Journey Demand Participant API
// -----------------------------------------------------------------------------
//
// Backend:
//     GET /journey-demands/:journeyDemandPublicId/participants/:participantPublicId
//
// Authentication:
//     Required.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { JourneyDemandParticipant } from '../../models';

export async function getJourneyDemandParticipant(
  journeyDemandPublicId: string,
  participantPublicId: string,
): Promise<JourneyDemandParticipant> {
  return authenticatedApiClient.get<JourneyDemandParticipant>(
    `/journey-demands/${journeyDemandPublicId}/participants/${participantPublicId}`,
  );
}