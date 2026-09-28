// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Participant API
// -----------------------------------------------------------------------------
//
// HTTP adapter for removing a Journey Demand participant.
//
// Backend endpoint:
//
//   DELETE /journey-demands/:journeyDemandPublicId/participants/:participantPublicId
//
// Backend request:
//
//   RemoveJourneyDemandParticipantDto
//
// Backend response:
//
//   void
//
// IMPORTANT CONTRACT NOTE:
//
// The backend removal DTO requires correlationId and optional causationId,
// while the current frontend DELETE abstraction does not support request
// bodies.
//
// The command metadata is therefore encoded as query parameters rather than
// being silently discarded.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

// -----------------------------------------------------------------------------
// Request
// -----------------------------------------------------------------------------

/**
 * Request payload for removing a Journey Demand participant.
 */
export interface RemoveJourneyDemandParticipantRequest {
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
 * Remove a participant from a Journey Demand.
 *
 * The participant public identifier is represented in the URL.
 *
 * Because the current authenticated HTTP client does not support DELETE
 * request bodies, correlation/causation metadata is sent as query parameters.
 */
export async function removeJourneyDemandParticipant(
  journeyDemandPublicId: string,
  participantPublicId: string,
  request: RemoveJourneyDemandParticipantRequest,
): Promise<void> {
  const query = new URLSearchParams({
    correlationId: request.correlationId,
  });

  if (request.causationId !== undefined) {
    query.set('causationId', request.causationId);
  }

  await authenticatedApiClient.delete<void>(
    `${JOURNEY_DEMANDS_PATH}/${encodeURIComponent(journeyDemandPublicId)}/participants/${encodeURIComponent(participantPublicId)}?${query.toString()}`,
  );
}