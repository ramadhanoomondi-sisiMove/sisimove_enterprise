// src/domains/journey-demand/application/queries/find-open-journey-demands.query.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Query for finding Journey Demands currently in the OPEN state.
 *
 * OPEN is the matchable Journey Demand lifecycle state.
 *
 * Pagination is optional and remains an application/query concern.
 */
export class FindOpenJourneyDemandsQuery extends Query {
  constructor(
    /**
     * Optional maximum number of open Journey Demands to return.
     */
    public readonly limit?: number,

    /**
     * Optional number of Journey Demands to skip.
     */
    public readonly offset?: number,
  ) {
    super();
  }
}
