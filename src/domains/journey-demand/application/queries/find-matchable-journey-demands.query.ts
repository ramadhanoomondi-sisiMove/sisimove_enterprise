// src/domains/journey-demand/application/queries/find-matchable-journey-demands.query.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Query for finding Journey Demands that are eligible for journey matching.
 *
 * Matchability is determined by the application/domain layer rather than by
 * pagination parameters. This query therefore contains only optional
 * pagination controls.
 */
export class FindMatchableJourneyDemandsQuery extends Query {
  constructor(
    /**
     * Optional maximum number of matchable Journey Demands to return.
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
