// src/domains/journey-demand/application/queries/get-journey-demand-participants.query.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyDemandPublicId } from '../../domain/value-objects/journey-demand-public-id.vo';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class GetJourneyDemandParticipantsQuery extends Query {
  constructor(
    /**
     * Public identifier of the Journey Demand.
     */
    public readonly journeyDemandPublicId: JourneyDemandPublicId,

    /**
     * Optional maximum number of participants to return.
     */
    public readonly limit?: number,

    /**
     * Optional number of participants to skip.
     */
    public readonly offset?: number,
  ) {
    super();
  }
}
