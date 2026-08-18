// -----------------------------------------------------------------------------
// Journey Booking — Capture Payment Command Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { CaptureJourneyBookingPaymentCommand } from '../commands/capture-journey-booking-payment.command';

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
 * Handles capture of an authorized Journey Booking payment.
 *
 * Workflow:
 *
 * 1. Find the Journey Booking aggregate.
 * 2. Fail when the aggregate does not exist.
 * 3. Delegate payment capture to the aggregate.
 * 4. Persist the updated aggregate.
 * 5. Return the updated aggregate.
 *
 * The aggregate owns the payment state transition and records the
 * corresponding domain event.
 */
export class CaptureJourneyBookingPaymentHandler implements CommandHandler<
  CaptureJourneyBookingPaymentCommand,
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
    command: CaptureJourneyBookingPaymentCommand,
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
    // Capture Payment
    // -------------------------------------------------------------------------

    aggregate.capturePayment(command.correlationId, command.causationId);

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
