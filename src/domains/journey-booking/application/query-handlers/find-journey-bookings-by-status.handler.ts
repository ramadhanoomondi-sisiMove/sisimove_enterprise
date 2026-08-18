// -----------------------------------------------------------------------------
// Journey Booking — Find Journey Bookings By Status Query Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { FindJourneyBookingsByStatusQuery } from '../queries/find-journey-bookings-by-status.query';

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
 * Handles retrieval of Journey Bookings matching a specified lifecycle
 * status.
 *
 * This is a collection/read query rather than aggregate rehydration.
 * The repository therefore returns JourneyBookingEntity instances.
 *
 * An empty result is valid and returns an empty array.
 */
export class FindJourneyBookingsByStatusHandler implements QueryHandler<
  FindJourneyBookingsByStatusQuery,
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
    query: FindJourneyBookingsByStatusQuery,
  ): Promise<JourneyBookingEntity[]> {
    // -------------------------------------------------------------------------
    // Status Lookup
    // -------------------------------------------------------------------------

    return this.repository.findJourneyBookingsByStatus(query.status);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FindJourneyBookingsByStatusHandler;
