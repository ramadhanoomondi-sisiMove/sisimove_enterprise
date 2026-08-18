// -----------------------------------------------------------------------------
// Journey Booking — Complete Command Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { CompleteJourneyBookingCommand } from '../commands/complete-journey-booking.command';

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
 * Handles completion of an existing Journey Booking.
 *
 * Application responsibilities:
 *
 * 1. Load the Journey Booking aggregate.
 * 2. Fail with JourneyBookingNotFoundException when it does not exist.
 * 3. Delegate completion to the aggregate.
 * 4. Persist the changed aggregate.
 * 5. Return the completed aggregate.
 *
 * Completion lifecycle rules and invariants remain inside the aggregate.
 */
export class CompleteJourneyBookingHandler implements CommandHandler<
  CompleteJourneyBookingCommand,
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
    command: CompleteJourneyBookingCommand,
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
    // Complete
    // -------------------------------------------------------------------------

    aggregate.complete(
      command.correlationId,
      command.causationId,
      command.completedAt,
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
