// -----------------------------------------------------------------------------
// Journey Booking — Confirm With Payment Command
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

// =============================================================================
// Command
// =============================================================================

/**
 * Atomically authorizes payment and confirms an existing Journey Booking.
 *
 * This command represents the complete booking-confirmation workflow where:
 *
 * 1. passenger funds are reserved;
 * 2. the corresponding financial HOLD transaction is created;
 * 3. the Journey Booking payment is authorized;
 * 4. the Journey Booking is confirmed;
 * 5. Journey capacity is reserved.
 *
 * All of the above operations are executed by the corresponding application
 * handler inside ONE PrismaUnitOfWork transaction.
 *
 * If any operation fails, the entire workflow is rolled back.
 *
 * Payment lifecycle invariants remain inside JourneyBookingAggregate.
 *
 * Financial balance rules remain inside FinancialAccountAggregate.
 *
 * Financial transaction rules remain inside FinancialTransactionAggregate.
 *
 * Financial hold lifecycle rules remain inside FinancialAccountHoldAggregate.
 *
 * Journey capacity mutation remains coordinated by JourneyRepository.
 */
export class ConfirmJourneyBookingWithPaymentCommand extends Command {
  constructor(
    // -------------------------------------------------------------------------
    // Journey Booking
    // -------------------------------------------------------------------------

    /**
     * Public identifier of the Journey Booking to authorize and confirm.
     */
    public readonly journeyBookingPublicId: JourneyBookingPublicId,

    // -------------------------------------------------------------------------
    // Financial Transaction
    // -------------------------------------------------------------------------

    /**
     * Public identifier of the external Financial transaction associated with
     * the successful payment authorization.
     *
     * This value is stored by the Journey Booking payment lifecycle and is
     * intentionally represented only by its public identifier across the
     * bounded-context boundary.
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
     * Identifier of the command or event that caused this workflow, when
     * applicable.
     */
    public readonly causationId?: string,

    // -------------------------------------------------------------------------
    // Authorization Time
    // -------------------------------------------------------------------------

    /**
     * Optional explicit payment authorization timestamp.
     *
     * When omitted, the downstream aggregate/application workflow uses the
     * current time according to its existing lifecycle rules.
     */
    public readonly authorizedAt?: Date,

    // -------------------------------------------------------------------------
    // Confirmation Time
    // -------------------------------------------------------------------------

    /**
     * Optional explicit booking confirmation timestamp.
     *
     * When omitted, the JourneyBookingAggregate uses the current time
     * according to its existing lifecycle rules.
     */
    public readonly confirmedAt?: Date,
  ) {
    super();
  }
}
