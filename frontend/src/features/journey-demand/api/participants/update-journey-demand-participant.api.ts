// -----------------------------------------------------------------------------
// sisiMove — Update Journey Demand Participant API
// -----------------------------------------------------------------------------
//
// Backend:
//     PUT /journey-demands/:journeyDemandPublicId/participants/:participantPublicId
//
// Authentication:
//     Required.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

export interface UpdateJourneyDemandParticipantInput {
  seats: number;
  correlationId?: string;
  causationId?: string;
}

export async function updateJourneyDemandParticipant(
  journeyDemandPublicId: string,
  participantPublicId: string,
  input: UpdateJourneyDemandParticipantInput,
): Promise<void> {
  await authenticatedApiClient.put(
    `/journey-demands/${journeyDemandPublicId}/participants/${participantPublicId}`,
    input,
  );
}