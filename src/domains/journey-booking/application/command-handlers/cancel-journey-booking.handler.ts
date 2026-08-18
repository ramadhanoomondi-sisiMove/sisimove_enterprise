// -----------------------------------------------------------------------------
// Journey Booking — Cancel Command Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { CancelJourneyBookingCommand } from '../commands/cancel-journey-booking.command';

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
 * Handles cancellation of an existing Journey Booking.
 *
 * Application responsibilities:
 *
 * 1. Load the Journey Booking aggregate.
 * 2. Fail with JourneyBookingNotFoundException when it does not exist.
 * 3. Delegate cancellation to the aggregate.
 * 4. Persist the changed aggregate.
 * 5. Return the cancelled aggregate.
 *
 * Cancellation lifecycle rules and invariants remain inside the aggregate.
 */
export class CancelJourneyBookingHandler implements CommandHandler<
  CancelJourneyBookingCommand,
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
    command: CancelJourneyBookingCommand,
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
    // Cancel
    // -------------------------------------------------------------------------

    aggregate.cancel(
      command.reason,
      command.cancelledByPublicId,
      command.reasonDescription,
      command.correlationId,
      command.causationId,
      command.cancelledAt,
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
