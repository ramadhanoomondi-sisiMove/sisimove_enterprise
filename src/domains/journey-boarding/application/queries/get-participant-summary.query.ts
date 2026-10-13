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
 * The query receives the validated identity public identifier of the target
 * participant. Presentation-layer mapping is responsible for converting
 * the incoming transport primitive into IdentityPublicId.
 *
 * The authenticated requester's identity, when required for contact-access
 * decisions, must originate from the trusted authenticated application
 * context and must never be accepted directly from an untrusted request body.
 *
 * Journey contact sharing is an internal authorization decision.
 * The trusted application layer may authorize contact sharing when it has
 * verified that both the requester and the target belong to the same
 * Journey Boarding.
 *
 * This includes:
 * - Passenger viewing another passenger's contact details.
 * - Passenger viewing the provider's contact details.
 * - Provider viewing a passenger's contact details.
 * - A participant viewing their own contact details.
 *
 * The application layer must verify boarding membership before enabling
 * journey contact sharing. This query does not independently establish
 * boarding membership or authorize contact sharing.
 */
export class GetParticipantSummaryQuery extends Query {
  constructor(
    /**
     * Public identity identifier of the participant whose summary is requested.
     */
    public readonly participantPublicId: IdentityPublicId,

    /**
     * Public identity identifier of the authenticated requester.
     *
     * Used by the handler to determine whether the requester is viewing
     * their own summary and to support contact-access decisions.
     *
     * This value must originate from trusted authenticated context.
     */
    public readonly requesterPublicId?: IdentityPublicId,

    /**
     * Whether the trusted application layer has authorized contact sharing
     * for the target participant within the relevant Journey Boarding.
     *
     * May be true only after the application layer verifies that the
     * requester and target belong to the same boarding.
     *
     * Defaults to false. Must never be populated from an untrusted request
     * body or query parameter.
     */
    public readonly allowJourneyContactSharing = false,
  ) {
    super();
  }
}
