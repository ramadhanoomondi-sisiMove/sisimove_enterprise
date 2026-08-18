// -----------------------------------------------------------------------------
// Journey Booking — Find Journey Bookings By Journey And Passenger Query
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  JourneyPublicId,
  JourneyBookingPassengerPublicId,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Retrieves Journey Bookings belonging to a specified passenger for a
 * specified Journey.
 *
 * Both cross-domain references are represented by public identifier value
 * objects. The query itself does not perform aggregate rehydration.
 */
export class FindJourneyBookingsByJourneyAndPassengerQuery extends Query {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identifier of the Journey.
     */
    public readonly journeyPublicId: JourneyPublicId,

    /**
     * Public identifier of the passenger.
     */
    public readonly passengerPublicId: JourneyBookingPassengerPublicId,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FindJourneyBookingsByJourneyAndPassengerQuery;
