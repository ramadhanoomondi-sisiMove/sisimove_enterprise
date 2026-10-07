// -----------------------------------------------------------------------------
// Journey Booking — Complete Command Handler
// -----------------------------------------------------------------------------
//
// Path:
// src/domains/journey-booking/application/handlers/complete-journey-booking.handler.ts
//
// Dependency injection:
//     JOURNEY_BOOKING_TOKENS.REPOSITORY
//
// Application responsibilities:
//
// 1. Load the Journey Booking aggregate.
// 2. Fail with JourneyBookingNotFoundException when it does not exist.
// 3. Delegate completion to the aggregate.
// 4. Persist the changed aggregate.
// 5. Return the completed aggregate.
//
// Completion lifecycle rules and invariants remain inside the aggregate.
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

import type { CompleteJourneyBookingCommand } from '../commands/complete-journey-booking.command';

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
 * Handles completion of an existing Journey Booking.
 *
 * The handler is an application-layer orchestrator.
 *
 * It does NOT:
 *
 * - implement completion lifecycle rules;
 * - decide whether the booking is eligible for completion;
 * - mutate booking state directly;
 * - contain persistence logic;
 * - recreate aggregate invariants.
 *
 * Those responsibilities remain inside the JourneyBookingAggregate.
 *
 * The workflow is:
 *
 *     CompleteJourneyBookingCommand
 *                ↓
 *     JourneyBookingRepository
 *                ↓
 *     JourneyBookingAggregate
 *                ↓
 *            complete()
 *                ↓
 *     JourneyBookingRepository.save()
 *
 * The repository is resolved through:
 *
 *     JOURNEY_BOOKING_TOKENS.REPOSITORY
 */
@Injectable()
export class CompleteJourneyBookingHandler implements CommandHandler<
  CompleteJourneyBookingCommand,
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
    command: CompleteJourneyBookingCommand,
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
    // Completion cannot be applied when the booking does not exist.
    //

    if (aggregate === null) {
      throw new JourneyBookingNotFoundException(
        command.journeyBookingPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Complete
    // -------------------------------------------------------------------------
    //
    // The aggregate owns the completion lifecycle and validates all completion
    // invariants.
    //
    // The handler only supplies the command data.
    //

    aggregate.complete(
      command.correlationId,
      command.causationId,
      command.completedAt,
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
