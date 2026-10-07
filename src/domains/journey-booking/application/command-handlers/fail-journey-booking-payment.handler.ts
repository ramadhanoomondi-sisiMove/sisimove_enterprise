// -----------------------------------------------------------------------------
// Journey Booking — Fail Payment Command Handler
// -----------------------------------------------------------------------------
//
// Path:
// src/domains/journey-booking/application/handlers/fail-journey-booking-payment.handler.ts
//
// Dependency injection:
//     JOURNEY_BOOKING_TOKENS.REPOSITORY
//
// Application responsibilities:
//
// 1. Load the Journey Booking aggregate.
// 2. Fail with JourneyBookingNotFoundException when it does not exist.
// 3. Delegate payment failure to the aggregate.
// 4. Persist the changed aggregate.
// 5. Return the updated aggregate.
//
// Payment lifecycle rules remain inside the JourneyBookingAggregate.
//
// Actual payment processing is performed outside this bounded context.
// This handler records the payment failure result received from the external
// payment workflow.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { FailJourneyBookingPaymentCommand } from '../commands/fail-journey-booking-payment.command';

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
// Dependency Injection Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_BOOKING_TOKENS } from '../journey-booking.tokens';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles failure of a Journey Booking payment.
 *
 * The handler is an application-layer orchestrator.
 *
 * It does NOT:
 *
 * - communicate directly with a payment provider;
 * - implement payment failure rules;
 * - mutate booking state directly;
 * - contain persistence logic;
 * - recreate aggregate invariants.
 *
 * Those responsibilities remain within their respective boundaries.
 *
 * The workflow is:
 *
 *     FailJourneyBookingPaymentCommand
 *                    ↓
 *     JourneyBookingRepository
 *                    ↓
 *     JourneyBookingAggregate
 *                    ↓
 *             failPayment()
 *                    ↓
 *     JourneyBookingRepository.save()
 *
 * The aggregate owns payment lifecycle validation and records the
 * JourneyBookingPaymentFailedEvent.
 *
 * The repository is resolved through:
 *
 *     JOURNEY_BOOKING_TOKENS.REPOSITORY
 */
@Injectable()
export class FailJourneyBookingPaymentHandler implements CommandHandler<
  FailJourneyBookingPaymentCommand,
  JourneyBookingAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    @Inject(JOURNEY_BOOKING_TOKENS.REPOSITORY)
    private readonly repository: JourneyBookingRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: FailJourneyBookingPaymentCommand,
  ): Promise<JourneyBookingAggregate> {
    // -------------------------------------------------------------------------
    // Load Aggregate
    // -------------------------------------------------------------------------
    //
    // Resolve the complete Journey Booking aggregate through the repository.
    //

    const aggregate = await this.repository.findByPublicId(
      command.journeyBookingPublicId,
    );

    // -------------------------------------------------------------------------
    // Not Found
    // -------------------------------------------------------------------------
    //
    // Payment failure cannot be applied when the booking does not exist.
    //

    if (aggregate === null) {
      throw new JourneyBookingNotFoundException(
        command.journeyBookingPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Fail Payment
    // -------------------------------------------------------------------------
    //
    // The aggregate owns the payment lifecycle and validates whether the
    // payment failure transition is currently allowed.
    //
    // The aggregate also records the corresponding domain event.
    //

    aggregate.failPayment(
      command.failureReason,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // Persistence
    // -------------------------------------------------------------------------
    //
    // Persist the aggregate after the domain operation succeeds.
    //

    await this.repository.save(aggregate);

    // -------------------------------------------------------------------------
    // Result
    // -------------------------------------------------------------------------

    return aggregate;
  }
}
