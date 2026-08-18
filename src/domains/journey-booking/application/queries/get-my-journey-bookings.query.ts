// -----------------------------------------------------------------------------
// Journey Booking — Get My Journey Bookings Query
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
 * Retrieves Journey Bookings belonging to the currently authenticated
 * passenger.
 *
 * The passenger identity is supplied by the authenticated application
 * context and represented by JourneyBookingPassengerPublicId.
 *
 * The client must never provide an arbitrary passenger public identifier
 * for this query.
 *
 * Filtering, pagination, and transport-specific concerns do not belong
 * to this query until they are explicitly supported by the application
 * and repository contracts.
 */
export class GetMyJourneyBookingsQuery extends Query {
  // =========================================================================== 
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identifier of the authenticated passenger.
     *
     * This value must be resolved from the authenticated request/application
     * context and must never be accepted directly from client input.
     */
    public readonly passengerPublicId: JourneyBookingPassengerPublicId,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetMyJourneyBookingsQuery;
