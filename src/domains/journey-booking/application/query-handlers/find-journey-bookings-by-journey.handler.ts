// -----------------------------------------------------------------------------
// Journey Booking — Find By Journey Query Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

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
// Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_BOOKING_TOKENS } from '../journey-booking.tokens';

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
 *
 * Dependency injection:
 *
 * The repository is resolved through the Journey Booking repository token.
 * The handler therefore depends on the repository contract rather than on a
 * concrete persistence implementation.
 */
@Injectable()
export class FindJourneyBookingsByJourneyHandler implements QueryHandler<
  FindJourneyBookingsByJourneyQuery,
  JourneyBookingEntity[]
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
