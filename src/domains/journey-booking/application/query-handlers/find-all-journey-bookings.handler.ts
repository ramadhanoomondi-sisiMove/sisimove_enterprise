/**
 * -----------------------------------------------------------------------------
 * Journey Booking — Find All Query Handler
 * -----------------------------------------------------------------------------
 */

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { FindAllJourneyBookingsQuery } from '../queries/find-all-journey-bookings.query';

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
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieving all Journey Booking aggregates.
 *
 * Responsibilities:
 *
 * 1. Query the Journey Booking repository for all booking aggregates.
 * 2. Return the aggregates with their available booking components.
 *
 * The repository owns persistence concerns and aggregate rehydration.
 * This handler delegates retrieval to the repository and does not access
 * the persistence implementation directly.
 *
 * Dependency injection:
 *
 * The repository is resolved through the Journey Booking repository token.
 * The handler depends on the repository contract rather than a concrete
 * persistence implementation.
 */
@Injectable()
export class FindAllJourneyBookingsQueryHandler implements QueryHandler<
  FindAllJourneyBookingsQuery,
  JourneyBookingAggregate[]
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

  public async execute(): Promise<JourneyBookingAggregate[]> {
    return this.repository.findAll();
  }
}
