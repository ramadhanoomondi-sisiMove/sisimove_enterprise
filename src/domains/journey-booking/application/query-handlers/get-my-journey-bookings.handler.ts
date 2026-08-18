// -----------------------------------------------------------------------------
// Journey Booking — Get My Journey Bookings Query Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetMyJourneyBookingsQuery } from '../queries/get-my-journey-bookings.query';

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
 * Handles retrieval of Journey Bookings belonging to the authenticated
 * passenger.
 *
 * The passenger identity is resolved by the authentication/application
 * context before this handler is invoked. The query therefore contains
 * a trusted JourneyBookingPassengerPublicId rather than a client-supplied
 * passenger identifier.
 *
 * This is a collection/read query, so the repository returns the root
 * JourneyBookingEntity instances rather than rehydrated aggregates.
 *
 * An authenticated passenger with no bookings receives an empty array.
 */
export class GetMyJourneyBookingsHandler implements QueryHandler<
  GetMyJourneyBookingsQuery,
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
    query: GetMyJourneyBookingsQuery,
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

export default GetMyJourneyBookingsHandler;
