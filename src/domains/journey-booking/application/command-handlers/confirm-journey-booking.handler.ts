// -----------------------------------------------------------------------------
// Journey Booking — Confirm Command Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { ConfirmJourneyBookingCommand } from '../commands/confirm-journey-booking.command';

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
 * Handles confirmation of an existing Journey Booking.
 *
 * The handler coordinates application concerns only:
 *
 * 1. Load the Journey Booking aggregate.
 * 2. Fail with a domain/application not-found exception when it does not
 *    exist.
 * 3. Delegate confirmation to the aggregate.
 * 4. Persist the changed aggregate.
 * 5. Return the confirmed aggregate.
 *
 * Confirmation invariants are owned by JourneyBookingAggregate.confirm().
 */
export class ConfirmJourneyBookingHandler implements CommandHandler<
  ConfirmJourneyBookingCommand,
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
    command: ConfirmJourneyBookingCommand,
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
    // Confirm
    // -------------------------------------------------------------------------

    aggregate.confirm(
      command.correlationId,
      command.causationId,
      command.confirmedAt,
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
