// -----------------------------------------------------------------------------
// Journey Booking — Fail Payment Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  JourneyBookingPaymentFailureReason,
  JourneyBookingPublicId,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Records a failed payment for a Journey Booking.
 *
 * The command carries validated domain value objects. The aggregate remains
 * responsible for validating whether the payment is currently allowed to
 * transition to FAILED.
 */
export class FailJourneyBookingPaymentCommand extends Command {
  constructor(
    // -------------------------------------------------------------------------
    // Journey Booking
    // -------------------------------------------------------------------------

    /**
     * Public identifier of the Journey Booking whose payment failed.
     */
    public readonly journeyBookingPublicId: JourneyBookingPublicId,

    // -------------------------------------------------------------------------
    // Failure Reason
    // -------------------------------------------------------------------------

    /**
     * Domain failure reason returned by the payment workflow.
     */
    public readonly failureReason: JourneyBookingPaymentFailureReason,

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
