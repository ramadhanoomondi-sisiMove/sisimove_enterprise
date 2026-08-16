// src/domains/journey/application/queries/journey/get-journeys-by-status.query.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyStatus } from '../../../domain/value-objects/journey-status.vo';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class GetJourneysByStatusQuery extends Query {
  constructor(
    /**
     * Journey lifecycle status.
     */
    public readonly status: JourneyStatus,
  ) {
    super();
  }
}
