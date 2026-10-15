// -----------------------------------------------------------------------------
// Journey Boarding — Count All Participants Query
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Counts all Journey Boarding participants across all Journey Boardings.
 *
 * This query does not require a Journey Boarding identifier because the count
 * is global rather than scoped to a single Journey Boarding.
 */
export class CountAllJourneyBoardingParticipantsQuery extends Query {
  constructor() {
    super();
  }
}
