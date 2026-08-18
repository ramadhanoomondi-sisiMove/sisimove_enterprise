// -----------------------------------------------------------------------------
// Journey Booking — Get Query Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyBookingQuery } from '../queries/get-journey-booking.query';

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
 * 2. Convert a missing aggregate into a domain/application exception.
 * 3. Return the fully rehydrated aggregate.
 *
 * The repository owns persistence and rehydration concerns.
 */
export class GetJourneyBookingHandler implements QueryHandler<
  GetJourneyBookingQuery,
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
    query: GetJourneyBookingQuery,
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
