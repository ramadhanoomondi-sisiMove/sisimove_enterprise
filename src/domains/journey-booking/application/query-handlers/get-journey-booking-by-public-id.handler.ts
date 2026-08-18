// -----------------------------------------------------------------------------
// Journey Booking — Get By Public ID Query Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyBookingByPublicIdQuery } from '../queries/get-journey-booking-by-public-id.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { JourneyBookingAggregate } from '../../domain/aggregates/journey-booking.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyBookingRepository } from '../../domain/repositories/journey-booking.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyBookingNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of a Journey Booking aggregate by public identifier.
 *
 * Responsibilities:
 *
 * 1. Query the Journey Booking repository.
 * 2. Translate a missing aggregate into JourneyBookingNotFoundException.
 * 3. Return the rehydrated JourneyBookingAggregate.
 *
 * Persistence and aggregate rehydration remain repository concerns.
 */
export class GetJourneyBookingByPublicIdHandler implements QueryHandler<
  GetJourneyBookingByPublicIdQuery,
  JourneyBookingAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly repository: JourneyBookingRepository) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetJourneyBookingByPublicIdQuery,
  ): Promise<JourneyBookingAggregate> {
    // -------------------------------------------------------------------------
    // Lookup
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      query.journeyBookingPublicId,
    );

    // -------------------------------------------------------------------------
    // Not Found
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new JourneyBookingNotFoundException(
        query.journeyBookingPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Result
    // -------------------------------------------------------------------------

    return aggregate;
  }
}
