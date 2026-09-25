// -----------------------------------------------------------------------------
// sisiMove — Withdraw Journey Demand Participant API
// -----------------------------------------------------------------------------
//
// Backend:
//     POST /journey-demands/:journeyDemandPublicId/participants/:participantPublicId/withdraw
//
// Authentication:
//     Required.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

export interface WithdrawJourneyDemandParticipantInput {
  correlationId?: string;
  causationId?: string;
}

export async function withdrawJourneyDemandParticipant(
  journeyDemandPublicId: string,
  participantPublicId: string,
  input: WithdrawJourneyDemandParticipantInput = {},
): Promise<void> {
  await authenticatedApiClient.post(
    `/journey-demands/${journeyDemandPublicId}/participants/${participantPublicId}/withdraw`,
    input,
  );
}