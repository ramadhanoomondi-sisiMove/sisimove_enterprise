// -----------------------------------------------------------------------------
// Journey Booking — Cancel Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  JourneyBookingCancellationReason,
  JourneyBookingPublicId,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Cancels an existing Journey Booking.
 *
 * The command identifies the booking and carries the cancellation information
 * required by the domain aggregate.
 *
 * Cancellation invariants and lifecycle rules remain inside
 * JourneyBookingAggregate.cancel().
 */
export class CancelJourneyBookingCommand extends Command {
  constructor(
    // -------------------------------------------------------------------------
    // Journey Booking
    // -------------------------------------------------------------------------

    /**
     * Public identifier of the Journey Booking to cancel.
     */
    public readonly journeyBookingPublicId: JourneyBookingPublicId,

    // -------------------------------------------------------------------------
    // Cancellation Reason
    // -------------------------------------------------------------------------

    /**
     * Domain cancellation reason.
     */
    public readonly reason: JourneyBookingCancellationReason,

    public readonly correlationId: string,

    // -------------------------------------------------------------------------
    // Cancelled By
    // -------------------------------------------------------------------------

    /**
     * Public identifier of the actor requesting the cancellation.
     *
     * This is an external identity reference and is therefore represented
     * only by its public identifier.
     */
    public readonly cancelledByPublicId?: string,

    // -------------------------------------------------------------------------
    // Reason Description
    // -------------------------------------------------------------------------

    /**
     * Optional human-readable explanation for the cancellation.
     */
    public readonly reasonDescription?: string,

    // -------------------------------------------------------------------------
    // Correlation
    // -------------------------------------------------------------------------

    /**
     * Correlation identifier for distributed tracing and workflow tracking.
     */

    // -------------------------------------------------------------------------
    // Causation
    // -------------------------------------------------------------------------

    /**
     * Identifier of the command or event that caused this command, when
     * applicable.
     */
    public readonly causationId?: string,

    // -------------------------------------------------------------------------
    // Cancellation Time
    // -------------------------------------------------------------------------

    /**
     * Optional explicit cancellation timestamp.
     *
     * When omitted, the aggregate uses the current time.
     */
    public readonly cancelledAt?: Date,
  ) {
    super();
  }
}
