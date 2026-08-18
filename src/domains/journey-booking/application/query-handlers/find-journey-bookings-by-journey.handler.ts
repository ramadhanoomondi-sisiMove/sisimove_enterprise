// -----------------------------------------------------------------------------
// Journey Booking — Find By Journey Query Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { FindJourneyBookingsByJourneyQuery } from '../queries/find-journey-bookings-by-journey.query';

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
 * Handles retrieval of Journey Bookings belonging to a Journey.
 *
 * The repository returns JourneyBookingEntity instances because this is a
 * collection query over the booking root rather than aggregate rehydration.
 *
 * Persistence and query optimization remain infrastructure concerns.
 */
export class FindJourneyBookingsByJourneyHandler implements QueryHandler<
  FindJourneyBookingsByJourneyQuery,
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
    query: FindJourneyBookingsByJourneyQuery,
  ): Promise<JourneyBookingEntity[]> {
    // -------------------------------------------------------------------------
    // Lookup
    // -------------------------------------------------------------------------

    return this.repository.findJourneyBookingsByJourneyPublicId(
      query.journeyPublicId,
    );
  }
}
