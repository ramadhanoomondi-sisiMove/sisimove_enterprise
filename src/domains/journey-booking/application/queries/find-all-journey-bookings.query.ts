// -----------------------------------------------------------------------------
// Journey Booking — Find All Query
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Requests all Journey Booking root records.
 *
 * Intended for the global administrative bookings listing.
 * The query exposes no persistence concerns and does not require
 * a Journey Booking public identifier.
 */
export class FindAllJourneyBookingsQuery extends Query {
  constructor() {
    super();
  }
}
