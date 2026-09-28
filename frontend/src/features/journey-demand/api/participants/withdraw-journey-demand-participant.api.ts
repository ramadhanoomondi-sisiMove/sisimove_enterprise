// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Participant API
// -----------------------------------------------------------------------------
//
// HTTP adapter for withdrawing a Journey Demand participant.
//
// Backend endpoint:
//
//   POST /journey-demands/:journeyDemandPublicId/participants/:participantPublicId/withdraw
//
// Backend request:
//
//   WithdrawJourneyDemandParticipantDto
//
// Backend response:
//
//   void
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

// -----------------------------------------------------------------------------
// Request
// -----------------------------------------------------------------------------

/**
 * Request payload for withdrawing a participant.
 */
export interface WithdrawJourneyDemandParticipantRequest {
  /**
   * Correlation identifier for distributed tracing.
   */
  readonly correlationId: string;

  /**
   * Optional causation identifier for distributed tracing.
   */
  readonly causationId?: string;
}

// -----------------------------------------------------------------------------
// Endpoint
// -----------------------------------------------------------------------------

const JOURNEY_DEMANDS_PATH = '/journey-demands';

// -----------------------------------------------------------------------------
// Mutation
// -----------------------------------------------------------------------------

/**
 * Withdraw a participant from a Journey Demand.
 *
 * Withdrawal is a backend lifecycle operation. The frontend does not mutate
 * participant status locally.
 */
export async function withdrawJourneyDemandParticipant(
  journeyDemandPublicId: string,
  participantPublicId: string,
  request: WithdrawJourneyDemandParticipantRequest,
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `${JOURNEY_DEMANDS_PATH}/${encodeURIComponent(journeyDemandPublicId)}/participants/${encodeURIComponent(participantPublicId)}/withdraw`,
    request,
  );
}