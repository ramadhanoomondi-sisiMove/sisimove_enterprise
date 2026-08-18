// -----------------------------------------------------------------------------
// Journey Booking — Find Journey Bookings By Passenger Query
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyBookingPassengerPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Retrieves Journey Bookings belonging to a specified passenger.
 *
 * Unlike GetMyJourneyBookingsQuery, this query explicitly accepts the
 * passenger public identifier because it is intended for application
 * workflows where the passenger being queried is known by the caller.
 *
 * Authorization and access-control decisions remain outside this query.
 */
export class FindJourneyBookingsByPassengerQuery extends Query {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identifier of the passenger whose Journey Bookings should
     * be retrieved.
     */
    public readonly passengerPublicId: JourneyBookingPassengerPublicId,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FindJourneyBookingsByPassengerQuery;
