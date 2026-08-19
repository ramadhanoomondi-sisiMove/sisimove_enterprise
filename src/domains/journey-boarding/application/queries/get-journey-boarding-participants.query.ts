// -----------------------------------------------------------------------------
// Journey Boarding — Get Participants Query
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
 * Retrieves all participants belonging to a Journey Boarding aggregate.
 *
 * The Journey Boarding aggregate is identified by its externally exposed
 * public identifier.
 *
 * The application handler resolves the public identifier to the aggregate
 * before using the aggregate's internal identity for the repository's
 * participant query.
 */
export class GetJourneyBoardingParticipantsQuery extends Query {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identifier of the Journey Boarding aggregate.
     */
    public readonly journeyBoardingPublicId: JourneyBoardingPublicId,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyBoardingParticipantsQuery;
