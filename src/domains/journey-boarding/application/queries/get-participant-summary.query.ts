// -----------------------------------------------------------------------------
// Journey Boarding — Get Participant Summary Query
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { IdentityPublicId } from '../../../identity/domain/value-objects';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Retrieves the public summary of a journey participant.
 *
 * The participant may be a provider or a passenger.
 *
 * The query receives the validated participant identity public identifier.
 * Presentation-layer mapping is responsible for converting the incoming
 * transport primitive into IdentityPublicId.
 *
 * The authenticated requester's identity, when required for contact-access
 * decisions, must be supplied from the authenticated application context,
 * never trusted directly from the request body.
 */
export class GetParticipantSummaryQuery extends Query {
  constructor(
    /**
     * Public identity identifier of the participant whose summary is requested.
     */
    public readonly participantPublicId: IdentityPublicId,

    /**
     * Public identity identifier of the authenticated requester.
     * Used by the handler to determine whether restricted contact details
     * may be included in the summary.
     */
    public readonly requesterPublicId?: IdentityPublicId,
  ) {
    super();
  }
}
