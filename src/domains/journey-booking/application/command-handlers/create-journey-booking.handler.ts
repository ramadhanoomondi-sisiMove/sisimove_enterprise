// -----------------------------------------------------------------------------
// Journey Booking — Create Command Handler
// -----------------------------------------------------------------------------
//
// Path:
// src/domains/journey-booking/application/handlers/create-journey-booking.handler.ts
//
// Dependency injection:
//     JOURNEY_BOOKING_TOKENS.REPOSITORY
//
// Application responsibilities:
//
// 1. Generate the Journey Booking public identity.
// 2. Ensure the generated identity does not already exist.
// 3. Create the Journey Booking entity in PENDING state.
// 4. Create the Journey Booking aggregate.
// 5. Persist the aggregate.
// 6. Return the created aggregate.
//
// JourneyBookingAggregate.create() records the JourneyBookingCreatedEvent.
//
// Snapshot, pricing, payment, and cancellation components are intentionally
// not created by this command. They belong to their respective application
// and domain workflows.
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

import type { CreateJourneyBookingCommand } from '../commands/create-journey-booking.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { JourneyBookingAggregate } from '../../domain/aggregates/journey-booking.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { JourneyBookingEntity } from '../../domain/entities/journey-booking.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyBookingRepository } from '../../domain/repositories/journey-booking.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyBookingPublicId,
  JourneyBookingStatus,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Dependency Injection Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_BOOKING_TOKENS } from '../journey-booking.tokens';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles creation of a Journey Booking aggregate.
 *
 * The application command is expected to contain already validated domain
 * value objects for:
 *
 * - Journey reference
 * - Passenger reference
 * - Requested seats
 *
 * The handler therefore orchestrates the creation workflow rather than
 * reconstructing or re-validating those value objects.
 *
 * The workflow is:
 *
 *     CreateJourneyBookingCommand
 *                ↓
 *     Generate Public ID
 *                ↓
 *     Check Uniqueness
 *                ↓
 *     Create Entity
 *                ↓
 *     Create Aggregate
 *                ↓
 *     Persist Aggregate
 *
 * The repository is resolved through:
 *
 *     JOURNEY_BOOKING_TOKENS.REPOSITORY
 */
@Injectable()
export class CreateJourneyBookingHandler implements CommandHandler<
  CreateJourneyBookingCommand,
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
    command: CreateJourneyBookingCommand,
  ): Promise<JourneyBookingAggregate> {
    // -------------------------------------------------------------------------
    // Journey Booking Public Identity
    // -------------------------------------------------------------------------
    //
    // The public identity is generated inside the application workflow.
    // Clients do not provide the booking public ID.
    //

    const journeyBookingPublicId = new JourneyBookingPublicId();

    // -------------------------------------------------------------------------
    // Uniqueness
    // -------------------------------------------------------------------------
    //
    // Protect the public identity boundary before creating the entity.
    //

    const alreadyExists = await this.repository.existsByPublicId(
      journeyBookingPublicId,
    );

    if (alreadyExists) {
      throw new Error(
        `Journey booking '${journeyBookingPublicId.value}' already exists.`,
      );
    }

    // -------------------------------------------------------------------------
    // Journey Booking Entity
    // -------------------------------------------------------------------------
    //
    // The booking starts in PENDING state.
    //
    // Domain value objects supplied by the command are passed directly into
    // the entity factory.
    //

    const journeyBooking = JourneyBookingEntity.create({
      publicId: journeyBookingPublicId,

      journeyPublicId: command.journeyPublicId,

      passengerPublicId: command.passengerPublicId,

      seats: command.seats,

      status: JourneyBookingStatus.pending(),
    });

    // -------------------------------------------------------------------------
    // Journey Booking Aggregate
    // -------------------------------------------------------------------------
    //
    // JourneyBookingAggregate.create() establishes the aggregate and records
    // the JourneyBookingCreatedEvent internally.
    //

    const aggregate = JourneyBookingAggregate.create(
      journeyBooking,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // Persistence
    // -------------------------------------------------------------------------
    //
    // Persist the aggregate only after the complete domain object has been
    // successfully created.
    //

    await this.repository.save(aggregate);

    // -------------------------------------------------------------------------
    // Result
    // -------------------------------------------------------------------------

    return aggregate;
  }
}
