// -----------------------------------------------------------------------------
// Journey Booking — Find Journey Booking By Transaction Query Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { FindJourneyBookingByTransactionQuery } from '../queries/find-journey-booking-by-transaction.query';

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
 * Handles retrieval of a Journey Booking by its associated Financial
 * transaction public identifier.
 *
 * The repository is responsible for locating the payment and resolving the
 * owning Journey Booking aggregate.
 */
export class FindJourneyBookingByTransactionHandler implements QueryHandler<
  FindJourneyBookingByTransactionQuery,
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
    query: FindJourneyBookingByTransactionQuery,
  ): Promise<JourneyBookingAggregate> {
    // -------------------------------------------------------------------------
    // Lookup
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByTransactionPublicId(
      query.transactionPublicId,
    );

    // -------------------------------------------------------------------------
    // Not Found
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new JourneyBookingNotFoundException(
        `Journey Booking associated with transaction '${query.transactionPublicId.value}' was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // Result
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FindJourneyBookingByTransactionHandler;
