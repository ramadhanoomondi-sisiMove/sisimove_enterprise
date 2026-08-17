// src/domains/journey-demand/application/queries/get-my-journey-demands.query.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { RequesterPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class GetMyJourneyDemandsQuery extends Query {
  constructor(
    /**
     * Public identifier of the requester.
     */
    public readonly requesterPublicId: RequesterPublicId,

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
