// -----------------------------------------------------------------------------
// Journey Booking — Complete Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyBookingPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Completes an existing Journey Booking.
 *
 * The command identifies the booking through its public identifier and carries
 * correlation metadata for domain-event and distributed-workflow tracing.
 *
 * Completion lifecycle rules remain inside JourneyBookingAggregate.complete().
 */
export class CompleteJourneyBookingCommand extends Command {
  constructor(
    // -------------------------------------------------------------------------
    // Journey Booking
    // -------------------------------------------------------------------------

    /**
     * Public identifier of the Journey Booking to complete.
     */
    public readonly journeyBookingPublicId: JourneyBookingPublicId,

    // -------------------------------------------------------------------------
    // Correlation
    // -------------------------------------------------------------------------

    /**
     * Correlation identifier for distributed tracing and workflow tracking.
     */
    public readonly correlationId: string,

    // -------------------------------------------------------------------------
    // Causation
    // -------------------------------------------------------------------------

    /**
     * Identifier of the command or event that caused this command, when
     * applicable.
     */
    public readonly causationId?: string,

    // -------------------------------------------------------------------------
    // Completion Time
    // -------------------------------------------------------------------------

    /**
     * Optional explicit completion timestamp.
     *
     * When omitted, the aggregate uses the current time.
     */
    public readonly completedAt?: Date,
  ) {
    super();
  }
}
