// src/domains/journey/application/queries/journey/get-journey-vehicle.query.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyPublicId } from '../../../domain/value-objects/journey-public-id.vo';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class GetJourneyVehicleQuery extends Query {
  constructor(
    /**
     * Public identifier of the Journey.
     */
    public readonly journeyPublicId: JourneyPublicId,
  ) {
    super();
  }
}
