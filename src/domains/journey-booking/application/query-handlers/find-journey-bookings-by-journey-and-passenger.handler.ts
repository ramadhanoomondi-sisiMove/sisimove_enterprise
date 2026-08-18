// -----------------------------------------------------------------------------
// Journey Booking — Find Journey Bookings By Journey And Passenger Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { FindJourneyBookingsByJourneyAndPassengerQuery } from '../queries/find-journey-bookings-by-journey-and-passenger.query';

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
 * Handles retrieval of Journey Bookings for a specific Journey and passenger.
 *
 * This is a collection/read query rather than aggregate rehydration.
 * The repository therefore returns JourneyBookingEntity instances.
 *
 * An empty result is valid and returns an empty array.
 */
export class FindJourneyBookingsByJourneyAndPassengerHandler implements QueryHandler<
  FindJourneyBookingsByJourneyAndPassengerQuery,
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
    query: FindJourneyBookingsByJourneyAndPassengerQuery,
  ): Promise<JourneyBookingEntity[]> {
    // -------------------------------------------------------------------------
    // Journey + Passenger Lookup
    // -------------------------------------------------------------------------

    return this.repository.findJourneyBookingsByJourneyAndPassenger(
      query.journeyPublicId,
      query.passengerPublicId,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FindJourneyBookingsByJourneyAndPassengerHandler;
