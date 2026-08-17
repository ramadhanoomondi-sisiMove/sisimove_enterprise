// src/domains/journey-demand/application/queries/get-journey-demands.query.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class GetJourneyDemandsQuery extends Query {
  constructor(
    /**
     * Optional maximum number of Journey Demands to return.
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
