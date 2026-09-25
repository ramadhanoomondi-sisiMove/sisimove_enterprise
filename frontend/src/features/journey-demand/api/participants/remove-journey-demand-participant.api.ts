// -----------------------------------------------------------------------------
// sisiMove — Remove Journey Demand Participant API
// -----------------------------------------------------------------------------
//
// Backend:
//     DELETE /journey-demands/:journeyDemandPublicId/participants/:participantPublicId
//
// Authentication:
//     Required.
//
// IMPORTANT:
//     The backend currently declares RemoveJourneyDemandParticipantDto as
//     @Body(), while AuthenticatedApiClient.delete() intentionally does not
//     accept a body.
//
//     See the architectural note accompanying the waypoint removal API.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

export interface RemoveJourneyDemandParticipantInput {
  correlationId?: string;
  causationId?: string;
}

export async function removeJourneyDemandParticipant(
  journeyDemandPublicId: string,
  participantPublicId: string,
  _input: RemoveJourneyDemandParticipantInput = {},
): Promise<void> {
  await authenticatedApiClient.delete(
    `/journey-demands/${journeyDemandPublicId}/participants/${participantPublicId}`,
  );
}