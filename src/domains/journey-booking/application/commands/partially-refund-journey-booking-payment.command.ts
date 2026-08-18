// -----------------------------------------------------------------------------
// Journey Booking — Partially Refund Payment Command
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
 * Records a partial refund for a captured Journey Booking payment.
 *
 * The aggregate is responsible for validating the payment state and applying
 * the partial refund transition.
 */
export class PartiallyRefundJourneyBookingPaymentCommand extends Command {
  constructor(
    // -------------------------------------------------------------------------
    // Journey Booking
    // -------------------------------------------------------------------------

    /**
     * Public identifier of the Journey Booking whose payment is being
     * partially refunded.
     */
    public readonly journeyBookingPublicId: JourneyBookingPublicId,

    // -------------------------------------------------------------------------
    // Refunded Amount
    // -------------------------------------------------------------------------

    /**
     * Amount being refunded.
     *
     * This is expressed in the payment's currency.
     */
    public readonly refundedAmount: number,

    // -------------------------------------------------------------------------
    // Remaining Amount
    // -------------------------------------------------------------------------

    /**
     * Remaining captured amount after the partial refund.
     *
     * This is expressed in the payment's currency.
     */
    public readonly remainingAmount: number,

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
