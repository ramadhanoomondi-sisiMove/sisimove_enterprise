// src/domains/journey/application/queries/journey/get-journey-waypoints.query.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { JourneyPublicId } from '../../../domain/value-objects/journey-public-id.vo';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class GetJourneyWaypointsQuery extends Query {
  constructor(
    /**
     * Public identifier of the Journey.
     */
    public readonly journeyPublicId: JourneyPublicId,
  ) {
    super();
  }
}
