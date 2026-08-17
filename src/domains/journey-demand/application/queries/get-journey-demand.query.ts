// src/domains/journey-demand/application/queries/get-journey-demand.query.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyDemandId } from '../../domain/value-objects/journey-demand-id.vo';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class GetJourneyDemandQuery extends Query {
  constructor(
    /**
     * Internal domain identifier of the Journey Demand.
     */
    public readonly journeyDemandId: JourneyDemandId,
  ) {
    super();
  }
}
