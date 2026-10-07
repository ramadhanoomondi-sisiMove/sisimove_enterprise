// -----------------------------------------------------------------------------
// Journey Booking — Get By Public ID Query Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

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
// Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_BOOKING_TOKENS } from '../journey-booking.tokens';

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
 *
 * Dependency injection:
 *
 * The repository is resolved through the Journey Booking repository token.
 * The handler therefore depends on the repository contract rather than on a
 * concrete persistence implementation.
 */
@Injectable()
export class GetJourneyBookingByPublicIdHandler implements QueryHandler<
  GetJourneyBookingByPublicIdQuery,
  JourneyBookingAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    @Inject(JOURNEY_BOOKING_TOKENS.REPOSITORY)
    private readonly repository: JourneyBookingRepository,
  ) {}

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
