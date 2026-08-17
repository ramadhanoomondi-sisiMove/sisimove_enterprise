// src/domains/journey-demand/application/queries/find-journey-demands-by-requester.query.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { RequesterPublicId } from '../../domain/value-objects/requester-public-id.vo';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Query for finding Journey Demands belonging to a requester.
 *
 * Aligned with:
 *
 * JourneyDemandRepository.findJourneyDemandsByRequesterPublicId(
 *   requesterPublicId: RequesterPublicId,
 * )
 */
export class FindJourneyDemandsByRequesterQuery extends Query {
  constructor(
    /**
     * Public identifier of the Identity that requested the Journey Demand.
     *
     * This is a cross-domain Identity.publicId reference and is represented
     * by the Journey Demand domain's RequesterPublicId value object.
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
