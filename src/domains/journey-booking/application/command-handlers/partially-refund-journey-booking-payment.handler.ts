// -----------------------------------------------------------------------------
// Journey Booking — Partially Refund Payment Command Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { PartiallyRefundJourneyBookingPaymentCommand } from '../commands/partially-refund-journey-booking-payment.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { JourneyBookingAggregate } from '../../domain/aggregates/journey-booking.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyBookingRepository } from '../../domain/repositories/journey-booking.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyBookingNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles a partial refund of a captured Journey Booking payment.
 *
 * Application workflow:
 *
 * 1. Find the Journey Booking aggregate.
 * 2. Fail when the aggregate does not exist.
 * 3. Delegate the partial refund transition to the aggregate.
 * 4. Persist the updated aggregate.
 * 5. Return the updated aggregate.
 *
 * The aggregate owns payment lifecycle validation and records the
 * JourneyBookingPaymentPartiallyRefundedEvent.
 *
 * Actual payment-provider refund execution remains outside this bounded
 * context.
 */
export class PartiallyRefundJourneyBookingPaymentHandler implements CommandHandler<
  PartiallyRefundJourneyBookingPaymentCommand,
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
    command: PartiallyRefundJourneyBookingPaymentCommand,
  ): Promise<JourneyBookingAggregate> {
    // -------------------------------------------------------------------------
    // Aggregate Lookup
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      command.journeyBookingPublicId,
    );

    if (aggregate === null) {
      throw new JourneyBookingNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Partial Refund
    // -------------------------------------------------------------------------

    aggregate.partiallyRefundPayment(
      command.refundedAmount,
      command.remainingAmount,
      command.correlationId,
      command.causationId,
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
