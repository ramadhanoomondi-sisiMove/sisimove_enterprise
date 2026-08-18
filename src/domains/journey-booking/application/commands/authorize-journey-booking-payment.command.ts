// -----------------------------------------------------------------------------
// Journey Booking — Authorize Payment Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  JourneyBookingPublicId,
  JourneyBookingTransactionPublicId,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Authorizes payment for an existing Journey Booking.
 *
 * The command identifies the Journey Booking and the external Financial
 * transaction associated with the successful authorization.
 *
 * Payment lifecycle invariants remain inside
 * JourneyBookingAggregate.authorizePayment().
 */
export class AuthorizeJourneyBookingPaymentCommand extends Command {
  constructor(
    // -------------------------------------------------------------------------
    // Journey Booking
    // -------------------------------------------------------------------------

    /**
     * Public identifier of the Journey Booking whose payment is being
     * authorized.
     */
    public readonly journeyBookingPublicId: JourneyBookingPublicId,

    // -------------------------------------------------------------------------
    // Financial Transaction
    // -------------------------------------------------------------------------

    /**
     * Public identifier of the Financial transaction created or associated
     * with the payment authorization.
     *
     * This is an external bounded-context reference represented only by its
     * public identifier.
     */
    public readonly transactionPublicId: JourneyBookingTransactionPublicId,

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
    // Authorization Time
    // -------------------------------------------------------------------------

    /**
     * Optional explicit authorization timestamp.
     *
     * When omitted, the aggregate uses the current time.
     */
    public readonly authorizedAt?: Date,
  ) {
    super();
  }
}
