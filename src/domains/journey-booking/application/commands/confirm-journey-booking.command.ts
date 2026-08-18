// -----------------------------------------------------------------------------
// Journey Booking — Confirm Command
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
 * Confirms an existing Journey Booking.
 *
 * The command identifies the booking through its public identifier and carries
 * correlation metadata for domain-event and distributed-workflow tracing.
 *
 * All confirmation invariants remain inside JourneyBookingAggregate.
 */
export class ConfirmJourneyBookingCommand extends Command {
  constructor(
    // -------------------------------------------------------------------------
    // Journey Booking
    // -------------------------------------------------------------------------

    /**
     * Public identifier of the Journey Booking to confirm.
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
    // Confirmation Time
    // -------------------------------------------------------------------------

    /**
     * Optional explicit confirmation timestamp.
     *
     * When omitted, the aggregate uses the current time.
     */
    public readonly confirmedAt?: Date,
  ) {
    super();
  }
}
