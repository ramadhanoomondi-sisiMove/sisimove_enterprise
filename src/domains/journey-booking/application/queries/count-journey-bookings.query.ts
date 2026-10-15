// -----------------------------------------------------------------------------
// Journey Booking — Count Query
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Counts all Journey Booking root records.
 *
 * The query exposes no persistence concerns and does not require
 * a Journey Booking public identifier.
 */
export class CountJourneyBookingsQuery extends Query {
  constructor() {
    super();
  }
}
