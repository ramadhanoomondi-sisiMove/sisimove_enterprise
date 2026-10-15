// -----------------------------------------------------------------------------
// Journey Booking — Count Query Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { CountJourneyBookingsQuery } from '../queries/count-journey-bookings.query';

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
 * Handles counting all Journey Booking root records.
 *
 * Responsibilities:
 *
 * 1. Query the Journey Booking repository.
 * 2. Return the total number of booking records.
 *
 * The repository owns persistence concerns and performs the count directly
 * without rehydrating Journey Booking aggregates.
 *
 * Dependency injection:
 *
 * The repository is resolved through the Journey Booking repository token.
 * The handler depends on the repository contract rather than a concrete
 * persistence implementation.
 */
@Injectable()
export class CountJourneyBookingsQueryHandler implements QueryHandler<
  CountJourneyBookingsQuery,
  number
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

  public async execute(): Promise<number> {
    return this.repository.count();
  }
}
