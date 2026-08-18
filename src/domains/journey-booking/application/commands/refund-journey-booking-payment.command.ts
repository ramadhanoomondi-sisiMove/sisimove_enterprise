// -----------------------------------------------------------------------------
// Journey Booking — Refund Payment Command
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
 * Refunds the full captured payment belonging to a Journey Booking.
 *
 * The command identifies the Journey Booking and carries correlation
 * information for workflow tracing.
 *
 * The aggregate is responsible for validating that the payment is captured
 * and can transition to REFUNDED.
 */
export class RefundJourneyBookingPaymentCommand extends Command {
  constructor(
    // -------------------------------------------------------------------------
    // Journey Booking
    // -------------------------------------------------------------------------

    /**
     * Public identifier of the Journey Booking whose captured payment is being
     * fully refunded.
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
  ) {
    super();
  }
}
