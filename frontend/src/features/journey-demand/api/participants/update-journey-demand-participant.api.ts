// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Participant API
// -----------------------------------------------------------------------------
//
// HTTP adapter for updating a Journey Demand participant.
//
// Backend endpoint:
//
//   PUT /journey-demands/:journeyDemandPublicId/participants/:participantPublicId
//
// Backend request:
//
//   UpdateJourneyDemandParticipantDto
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
 * Request payload for updating participant seat requirements.
 */
export interface UpdateJourneyDemandParticipantRequest {
  /**
   * Number of seats requested by the participant.
   */
  readonly seats: number;

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
 * Update a Journey Demand participant.
 *
 * The participant public identifier is represented in the URL.
 */
export async function updateJourneyDemandParticipant(
  journeyDemandPublicId: string,
  participantPublicId: string,
  request: UpdateJourneyDemandParticipantRequest,
): Promise<void> {
  await authenticatedApiClient.put<void>(
    `${JOURNEY_DEMANDS_PATH}/${encodeURIComponent(journeyDemandPublicId)}/participants/${encodeURIComponent(participantPublicId)}`,
    request,
  );
}