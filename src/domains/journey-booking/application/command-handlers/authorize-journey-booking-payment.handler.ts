// -----------------------------------------------------------------------------
// Journey Booking — Authorize Payment Command Handler
// -----------------------------------------------------------------------------
//
// Path:
// src/domains/journey-booking/application/handlers/authorize-journey-booking-payment.handler.ts
//
// Dependency injection:
//     JOURNEY_BOOKING_TOKENS.REPOSITORY
//
// The repository is injected through the Journey Booking dependency-injection
// token rather than directly relying on a concrete repository implementation.
//
// Application responsibilities:
//
// 1. Load the Journey Booking aggregate.
// 2. Fail with JourneyBookingNotFoundException when it does not exist.
// 3. Delegate payment authorization to the aggregate.
// 4. Persist the changed aggregate.
// 5. Return the updated aggregate.
//
// Payment lifecycle rules remain inside the JourneyBookingAggregate.
//
// Actual payment processing is performed outside this bounded context.
// This handler records the authorization result received from the external
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
// Dependency Injection Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_BOOKING_TOKENS } from '../journey-booking.tokens';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles payment authorization for an existing Journey Booking.
 *
 * The handler is an application-layer orchestrator.
 *
 * It does NOT:
 *
 * - implement payment rules;
 * - mutate booking state directly;
 * - perform payment-provider communication;
 * - contain persistence logic;
 * - recreate aggregate invariants.
 *
 * Those responsibilities belong to their respective boundaries.
 *
 * The handler:
 *
 *     Command
 *       ↓
 *     Repository
 *       ↓
 *     JourneyBookingAggregate
 *       ↓
 *     authorizePayment()
 *       ↓
 *     Repository.save()
 *
 * The repository is resolved through:
 *
 *     JOURNEY_BOOKING_TOKENS.REPOSITORY
 *
 * This keeps the application layer dependent on the repository contract while
 * allowing the infrastructure module to provide the concrete implementation.
 */
@Injectable()
export class AuthorizeJourneyBookingPaymentHandler implements CommandHandler<
  AuthorizeJourneyBookingPaymentCommand,
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
    command: AuthorizeJourneyBookingPaymentCommand,
  ): Promise<JourneyBookingAggregate> {
    // -------------------------------------------------------------------------
    // Load Aggregate
    // -------------------------------------------------------------------------
    //
    // The repository resolves the complete Journey Booking aggregate.
    //
    // The application layer does not query Prisma or any infrastructure
    // implementation directly.
    //

    const aggregate = await this.repository.findByPublicId(
      command.journeyBookingPublicId,
    );

    // -------------------------------------------------------------------------
    // Not Found
    // -------------------------------------------------------------------------
    //
    // A payment authorization cannot be applied when the booking does not
    // exist.
    //

    if (aggregate === null) {
      throw new JourneyBookingNotFoundException(
        command.journeyBookingPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Authorize Payment
    // -------------------------------------------------------------------------
    //
    // The aggregate owns the payment lifecycle rules and validates whether
    // authorization is currently allowed.
    //
    // The handler only supplies the command data.
    //

    aggregate.authorizePayment(
      command.transactionPublicId,
      command.correlationId,
      command.causationId,
      command.authorizedAt,
    );

    // -------------------------------------------------------------------------
    // Persistence
    // -------------------------------------------------------------------------
    //
    // Persist the aggregate after the domain operation succeeds.
    //
    // The repository is responsible for translating the aggregate state and
    // domain events into the infrastructure persistence model.
    //

    await this.repository.save(aggregate);

    // -------------------------------------------------------------------------
    // Result
    // -------------------------------------------------------------------------

    return aggregate;
  }
}
