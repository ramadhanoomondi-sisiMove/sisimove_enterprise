// src/domains/journey-demand/application/queries/find-journey-demands-by-corridor.query.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyDemandCorridorId } from '../../domain/value-objects/journey-demand-corridor-id.vo';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Find Journey Demands associated with a Journey Demand corridor.
 *
 * The corridor identifier is the internal domain identifier.
 *
 * This query is intentionally aligned with:
 *
 * JourneyDemandRepository.findJourneyDemandsByCorridorId(
 *   corridorId: JourneyDemandCorridorId,
 * )
 *
 * Pagination is optional and remains an application/query concern rather than
 * becoming part of the domain value object.
 */
export class FindJourneyDemandsByCorridorQuery extends Query {
  constructor(
    /**
     * Internal identifier of the Journey Demand corridor.
     */
    public readonly corridorId: JourneyDemandCorridorId,

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
