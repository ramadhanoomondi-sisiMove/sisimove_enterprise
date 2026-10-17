// -----------------------------------------------------------------------------
// sisiMove — Find Detailed Journey Bookings By Passenger Query
// -----------------------------------------------------------------------------
//
// Purpose
// -------
//
// Requests detailed booking representations for a specified passenger.
//
// The corresponding query handler is responsible for:
//
//   1. finding the passenger's Journey Booking records;
//   2. resolving the detailed representation of each booking;
//   3. returning the detailed results for the application read boundary.
//
// Authorization
// -------------
//
// This query carries the passenger identifier. The calling controller or
// application boundary must enforce the appropriate access permissions.
//
// Value Objects
// -------------
//
// The passenger identifier remains a strongly typed Value Object.
//
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

import type { JourneyBookingPassengerPublicId } from '../../domain/value-objects';

export class FindDetailedJourneyBookingsByPassengerQuery extends Query {
  constructor(
    public readonly passengerPublicId: JourneyBookingPassengerPublicId,
  ) {
    super();
  }
}
