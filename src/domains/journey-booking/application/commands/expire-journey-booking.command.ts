// -----------------------------------------------------------------------------
// Journey Booking — Expire Command
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
 * Expires an existing Journey Booking.
 *
 * The command identifies the booking through its public identifier and carries
 * correlation metadata for distributed-workflow tracing.
 *
 * Expiration lifecycle rules remain inside JourneyBookingAggregate.expire().
 */
export class ExpireJourneyBookingCommand extends Command {
  constructor(
    // -------------------------------------------------------------------------
    // Journey Booking
    // -------------------------------------------------------------------------

    /**
     * Public identifier of the Journey Booking to expire.
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
    // Expiration Time
    // -------------------------------------------------------------------------

    /**
     * Optional explicit expiration timestamp.
     *
     * When omitted, the aggregate uses the current time.
     */
    public readonly expiredAt?: Date,
  ) {
    super();
  }
}
