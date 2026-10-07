// -----------------------------------------------------------------------------
// Journey Booking — Cancel Command Handler
// -----------------------------------------------------------------------------
//
// Path:
// src/domains/journey-booking/application/handlers/cancel-journey-booking.handler.ts
//
// Dependency injection:
//     JOURNEY_BOOKING_TOKENS.REPOSITORY
//
// The repository is injected through the Journey Booking DI token rather than
// directly relying on a concrete repository implementation.
//
// Application responsibilities:
//
// 1. Load the Journey Booking aggregate.
// 2. Fail with JourneyBookingNotFoundException when it does not exist.
// 3. Delegate cancellation to the aggregate.
// 4. Persist the changed aggregate.
// 5. Return the cancelled aggregate.
//
// Cancellation lifecycle rules and invariants remain inside the aggregate.
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

import type { CancelJourneyBookingCommand } from '../commands/cancel-journey-booking.command';

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
 * Handles cancellation of an existing Journey Booking.
 *
 * The handler is an application-layer orchestrator.
 *
 * It does NOT:
 *
 * - implement cancellation rules;
 * - mutate booking state directly;
 * - decide whether cancellation is permitted;
 * - contain persistence logic;
 * - recreate aggregate invariants.
 *
 * Those responsibilities remain inside the JourneyBookingAggregate and
 * repository boundaries.
 *
 * The workflow is:
 *
 *     CancelJourneyBookingCommand
 *                ↓
 *     JourneyBookingRepository
 *                ↓
 *     JourneyBookingAggregate
 *                ↓
 *            cancel()
 *                ↓
 *     JourneyBookingRepository.save()
 *
 * The repository is resolved through:
 *
 *     JOURNEY_BOOKING_TOKENS.REPOSITORY
 */
@Injectable()
export class CancelJourneyBookingHandler implements CommandHandler<
  CancelJourneyBookingCommand,
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
    command: CancelJourneyBookingCommand,
  ): Promise<JourneyBookingAggregate> {
    // -------------------------------------------------------------------------
    // Load Aggregate
    // -------------------------------------------------------------------------
    //
    // Resolve the complete Journey Booking aggregate through the repository.
    //
    // The application layer remains independent of Prisma or any other
    // infrastructure persistence implementation.
    //

    const aggregate = await this.repository.findByPublicId(
      command.journeyBookingPublicId,
    );

    // -------------------------------------------------------------------------
    // Not Found
    // -------------------------------------------------------------------------
    //
    // Cancellation cannot be applied when the booking does not exist.
    //

    if (aggregate === null) {
      throw new JourneyBookingNotFoundException(
        command.journeyBookingPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Cancel
    // -------------------------------------------------------------------------
    //
    // The aggregate owns the cancellation lifecycle and validates all
    // cancellation invariants.
    //
    // The handler only supplies the command data.
    //

    aggregate.cancel(
      command.reason,
      command.cancelledByPublicId,
      command.reasonDescription,
      command.correlationId,
      command.causationId,
      command.cancelledAt,
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
