// -----------------------------------------------------------------------------
// Journey Boarding — Get Query
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyBoardingPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Retrieves a Journey Boarding aggregate by its public identifier.
 *
 * The query receives the validated domain value object. Presentation-layer
 * mapping is responsible for converting the incoming transport primitive
 * into JourneyBoardingPublicId.
 */
export class GetJourneyBoardingQuery extends Query {
  constructor(
    /**
     * Public identifier of the Journey Boarding.
     */
    public readonly journeyBoardingPublicId: JourneyBoardingPublicId,
  ) {
    super();
  }
}
