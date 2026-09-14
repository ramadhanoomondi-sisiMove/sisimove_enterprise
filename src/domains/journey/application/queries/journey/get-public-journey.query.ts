// src/domains/journey/application/queries/public/get-public-journey.query.ts

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

/**
 * Retrieves a Journey through the public read boundary.
 *
 * Unlike GetJourneyQuery, this query represents a public-facing read
 * operation. The handler is responsible for enforcing the Journey's
 * public visibility rules.
 *
 * A Journey being addressable by publicId does not automatically make it
 * publicly discoverable. The public query must therefore apply the
 * appropriate visibility policy before returning the result.
 */
export class GetPublicJourneyQuery extends Query {
  constructor(
    /**
     * Public identifier of the Journey.
     */
    public readonly journeyPublicId: JourneyPublicId,
  ) {
    super();
  }
}
