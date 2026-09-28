// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Participant API
// -----------------------------------------------------------------------------
//
// HTTP adapter for adding a participant to a Journey Demand.
//
// Backend endpoint:
//
//   POST /journey-demands/:journeyDemandPublicId/participants
//
// Backend request:
//
//   AddJourneyDemandParticipantDto
//
// Backend response:
//
//   void
//
// Participant identity is represented by opaque public identifiers. The
// frontend does not recreate Identity or Journey Demand Participant entities.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

// -----------------------------------------------------------------------------
// Request
// -----------------------------------------------------------------------------

/**
 * Request payload for adding a Journey Demand participant.
 *
 * This mirrors `AddJourneyDemandParticipantDto`.
 */
export interface AddJourneyDemandParticipantRequest {
  /**
   * Public identifier of the participant record being added.
   */
  readonly participantPublicId: string;

  /**
   * Public identifier of the member participating in the demand.
   */
  readonly memberPublicId: string;

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
 * Add a participant to a Journey Demand.
 *
 * Participant creation/validation and participant lifecycle ownership remain
 * entirely on the backend.
 */
export async function addJourneyDemandParticipant(
  journeyDemandPublicId: string,
  request: AddJourneyDemandParticipantRequest,
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `${JOURNEY_DEMANDS_PATH}/${encodeURIComponent(journeyDemandPublicId)}/participants`,
    request,
  );
}