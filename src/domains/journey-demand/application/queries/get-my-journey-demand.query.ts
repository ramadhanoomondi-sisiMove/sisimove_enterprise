// src/domains/journey-demand/application/queries/get-my-journey-demand.query.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  JourneyDemandPublicId,
  RequesterPublicId,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class GetMyJourneyDemandQuery extends Query {
  constructor(
    /**
     * Public identifier of the authenticated requester.
     *
     * This value is derived from the authenticated identity by the controller.
     * It is never supplied independently by the client.
     */
    public readonly requesterPublicId: RequesterPublicId,

    /**
     * Public identifier of the Journey Demand being requested.
     */
    public readonly journeyDemandPublicId: JourneyDemandPublicId,
  ) {
    super();
  }
}
