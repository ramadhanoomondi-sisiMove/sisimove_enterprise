// -----------------------------------------------------------------------------
// Journey Booking — Authorize Payment Command Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { AuthorizeJourneyBookingPaymentCommand } from '../commands/authorize-journey-booking-payment.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { JourneyBookingAggregate } from '../../domain/aggregates/journey-booking.aggregate';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyBookingNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyBookingRepository } from '../../domain/repositories/journey-booking.repository';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles payment authorization for an existing Journey Booking.
 *
 * Application responsibilities:
 *
 * 1. Load the Journey Booking aggregate.
 * 2. Fail with JourneyBookingNotFoundException when it does not exist.
 * 3. Delegate payment authorization to the aggregate.
 * 4. Persist the changed aggregate.
 * 5. Return the updated aggregate.
 *
 * Payment lifecycle rules remain inside the aggregate.
 *
 * Actual payment processing is performed outside this bounded context.
 * This handler records the resulting authorization state received from the
 * external payment workflow.
 */
export class AuthorizeJourneyBookingPaymentHandler implements CommandHandler<
  AuthorizeJourneyBookingPaymentCommand,
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
    command: AuthorizeJourneyBookingPaymentCommand,
  ): Promise<JourneyBookingAggregate> {
    // -------------------------------------------------------------------------
    // Load Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      command.journeyBookingPublicId,
    );

    // -------------------------------------------------------------------------
    // Not Found
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new JourneyBookingNotFoundException(
        command.journeyBookingPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Authorize Payment
    // -------------------------------------------------------------------------

    aggregate.authorizePayment(
      command.transactionPublicId,
      command.correlationId,
      command.causationId,
      command.authorizedAt,
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
