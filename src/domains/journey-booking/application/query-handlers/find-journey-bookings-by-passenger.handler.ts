// -----------------------------------------------------------------------------
// Journey Booking — Find Journey Bookings By Passenger Query Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { FindJourneyBookingsByPassengerQuery } from '../queries/find-journey-bookings-by-passenger.query';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { JourneyBookingEntity } from '../../domain/entities/journey-booking.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyBookingRepository } from '../../domain/repositories/journey-booking.repository';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of Journey Bookings belonging to a specified passenger.
 *
 * This is a collection/read query rather than aggregate rehydration.
 * Consequently, the repository returns JourneyBookingEntity instances.
 *
 * An empty result is valid and returns an empty array.
 */
export class FindJourneyBookingsByPassengerHandler implements QueryHandler<
  FindJourneyBookingsByPassengerQuery,
  JourneyBookingEntity[]
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly repository: JourneyBookingRepository) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: FindJourneyBookingsByPassengerQuery,
  ): Promise<JourneyBookingEntity[]> {
    // -------------------------------------------------------------------------
    // Passenger Bookings
    // -------------------------------------------------------------------------

    return this.repository.findJourneyBookingsByPassengerPublicId(
      query.passengerPublicId,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FindJourneyBookingsByPassengerHandler;
