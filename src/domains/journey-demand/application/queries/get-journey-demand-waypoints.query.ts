// src/domains/journey-demand/application/queries/get-journey-demand-waypoints.query.ts

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

export class GetJourneyDemandWaypointsQuery extends Query {
  constructor(
    /**
     * Public identifier of the Journey Demand.
     */
    public readonly journeyDemandPublicId: JourneyDemandPublicId,
  ) {
    super();
  }
}
