// src/domains/journey-demand/application/queries/get-journey-demand-participant.query.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyDemandPublicId } from '../../domain/value-objects/journey-demand-public-id.vo';
import type { JourneyDemandParticipantPublicId } from '../../domain/value-objects/journey-demand-participant-public-id.vo';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class GetJourneyDemandParticipantQuery extends Query {
  constructor(
    /**
     * Public identifier of the Journey Demand.
     */
    public readonly journeyDemandPublicId: JourneyDemandPublicId,

    /**
     * Public identifier of the Journey Demand participant.
     */
    public readonly participantPublicId: JourneyDemandParticipantPublicId,
  ) {
    super();
  }
}
