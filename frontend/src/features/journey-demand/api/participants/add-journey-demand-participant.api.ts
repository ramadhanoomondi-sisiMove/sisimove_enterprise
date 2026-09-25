// -----------------------------------------------------------------------------
// sisiMove — Add Journey Demand Participant API
// -----------------------------------------------------------------------------
//
// Backend:
//     POST /journey-demands/:journeyDemandPublicId/participants
//
// Authentication:
//     Required.
//
// IMPORTANT:
//     Participant seats are managed separately through the participant update
//     endpoint.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { JourneyDemandParticipantInput } from '../../schemas';

export async function addJourneyDemandParticipant(
  journeyDemandPublicId: string,
  input: JourneyDemandParticipantInput,
): Promise<void> {
  await authenticatedApiClient.post(
    `/journey-demands/${journeyDemandPublicId}/participants`,
    input,
  );
}