// -----------------------------------------------------------------------------
// Journey Booking — Confirm Command Handler
// -----------------------------------------------------------------------------
//
// Path:
// src/domains/journey-booking/application/handlers/confirm-journey-booking.handler.ts
//
// Dependency injection:
//     JOURNEY_BOOKING_TOKENS.REPOSITORY
//
// Application responsibilities:
//
// 1. Load the Journey Booking aggregate.
// 2. Fail with JourneyBookingNotFoundException when it does not exist.
// 3. Delegate confirmation to the aggregate.
// 4. Persist the changed aggregate.
// 5. Return the confirmed aggregate.
//
// Confirmation lifecycle rules and invariants remain inside the aggregate.
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

import type { ConfirmJourneyBookingCommand } from '../commands/confirm-journey-booking.command';

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
 * Handles confirmation of an existing Journey Booking.
 *
 * The handler is an application-layer orchestrator.
 *
 * It does NOT:
 *
 * - implement confirmation rules;
 * - decide whether the booking can be confirmed;
 * - mutate booking state directly;
 * - contain persistence logic;
 * - recreate aggregate invariants.
 *
 * Those responsibilities remain inside the JourneyBookingAggregate.
 *
 * The workflow is:
 *
 *     ConfirmJourneyBookingCommand
 *                ↓
 *     JourneyBookingRepository
 *                ↓
 *     JourneyBookingAggregate
 *                ↓
 *            confirm()
 *                ↓
 *     JourneyBookingRepository.save()
 *
 * The repository is resolved through:
 *
 *     JOURNEY_BOOKING_TOKENS.REPOSITORY
 */
@Injectable()
export class ConfirmJourneyBookingHandler implements CommandHandler<
  ConfirmJourneyBookingCommand,
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
    command: ConfirmJourneyBookingCommand,
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
    // Confirmation cannot be applied when the booking does not exist.
    //

    if (aggregate === null) {
      throw new JourneyBookingNotFoundException(
        command.journeyBookingPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Confirm
    // -------------------------------------------------------------------------
    //
    // The aggregate owns the confirmation lifecycle and validates all
    // confirmation invariants.
    //
    // The handler only supplies the command data.
    //

    aggregate.confirm(
      command.correlationId,
      command.causationId,
      command.confirmedAt,
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
