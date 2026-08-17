// src/domains/journey-demand/application/queries/get-journey-demand-capacity.query.ts

// -----------------------------------------------------------------------------
// Journey Demand — Get Capacity Query
// -----------------------------------------------------------------------------

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

/**
 * Query for retrieving the capacity configuration of a Journey Demand.
 *
 * The Journey Demand is addressed through its public identifier.
 */
export class GetJourneyDemandCapacityQuery extends Query {
  constructor(
    /**
     * Public identifier of the Journey Demand.
     */
    public readonly journeyDemandPublicId: JourneyDemandPublicId,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyDemandCapacityQuery;
