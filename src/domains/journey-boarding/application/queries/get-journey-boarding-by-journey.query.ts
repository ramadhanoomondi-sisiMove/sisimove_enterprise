// -----------------------------------------------------------------------------
// Journey Boarding — Get By Journey Query
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyBoardingJourneyId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Retrieves the Journey Boarding associated with a Journey.
 *
 * A Journey owns at most one Journey Boarding aggregate.
 */
export class GetJourneyBoardingByJourneyQuery extends Query {
  constructor(
    /**
     * Public identifier of the Journey whose boarding process is requested.
     */
    public readonly journeyId: JourneyBoardingJourneyId,
  ) {
    super();
  }
}
