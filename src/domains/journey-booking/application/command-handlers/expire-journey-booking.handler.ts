// -----------------------------------------------------------------------------
// Journey Booking — Expire Command Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { ExpireJourneyBookingCommand } from '../commands/expire-journey-booking.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { JourneyBookingAggregate } from '../../domain/aggregates/journey-booking.aggregate';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyBookingNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyBookingRepository } from '../../domain/repositories/journey-booking.repository';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles expiration of an existing Journey Booking.
 *
 * Application responsibilities:
 *
 * 1. Load the Journey Booking aggregate.
 * 2. Fail with JourneyBookingNotFoundException when it does not exist.
 * 3. Delegate expiration to the aggregate.
 * 4. Persist the changed aggregate.
 * 5. Return the expired aggregate.
 *
 * Expiration lifecycle rules and invariants remain inside the aggregate.
 */
export class ExpireJourneyBookingHandler implements CommandHandler<
  ExpireJourneyBookingCommand,
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
    command: ExpireJourneyBookingCommand,
  ): Promise<JourneyBookingAggregate> {
    // -------------------------------------------------------------------------
    // Load Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      command.journeyBookingPublicId,
    );

    // -------------------------------------------------------------------------
    // Not Found
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new JourneyBookingNotFoundException(
        command.journeyBookingPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Expire
    // -------------------------------------------------------------------------

    aggregate.expire(
      command.correlationId,
      command.causationId,
      command.expiredAt,
    );

    // -------------------------------------------------------------------------
    // Persistence
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);

    // -------------------------------------------------------------------------
    // Result
    // -------------------------------------------------------------------------

    return aggregate;
  }
}
