// src/domains/journey/application/handlers/journey/attach-journey-capacity.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Capacity Command Handler
// -----------------------------------------------------------------------------
//
// Application-layer command handler for configuring Journey capacity.
//
// Responsibilities:
// - resolve the Journey aggregate;
// - create a new Journey Capacity child entity from command data;
// - delegate the attachment mutation to the Journey aggregate;
// - persist the mutated aggregate.
//
// The handler does NOT:
// - access Prisma directly;
// - perform HTTP concerns;
// - mutate persistence models;
// - implement Journey business rules.
//
// Journey owns the capacity child and its attachment relationship.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { AttachJourneyCapacityCommand } from '../../commands/journey/attach-journey-capacity.command';

// -----------------------------------------------------------------------------
// Domain — Entity
// -----------------------------------------------------------------------------

import { JourneyCapacityEntity } from '../../../domain/entities/journey-capacity.entity';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyNotFoundException } from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyCapacityPublicId,
  JourneyBookedSeats,
  JourneyTotalSeats,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Application Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_TOKENS } from '../../journey.tokens';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class AttachJourneyCapacityHandler implements CommandHandler<
  AttachJourneyCapacityCommand,
  void
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly journeyRepository: JourneyRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(command: AttachJourneyCapacityCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    // -------------------------------------------------------------------------

    const journey = await this.journeyRepository.findByPublicId(
      command.journeyPublicId,
    );

    if (journey === null) {
      throw new JourneyNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Create Capacity
    // -------------------------------------------------------------------------
    //
    // JourneyCapacity is a Journey-owned child entity.
    //
    // Its public ID is generated here because the caller is configuring a new
    // child rather than attaching an existing capacity record.
    //
    // A newly configured Journey has no bookings, therefore booked seats start
    // at zero.
    //

    const capacity = JourneyCapacityEntity.create({
      publicId: new JourneyCapacityPublicId(),
      totalSeats: new JourneyTotalSeats(command.totalSeats),
      bookedSeats: new JourneyBookedSeats(0),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // -------------------------------------------------------------------------
    // Aggregate Mutation
    // -------------------------------------------------------------------------
    //
    // The Journey aggregate owns the capacity attachment relationship and
    // remains responsible for enforcing its domain invariants.
    //

    journey.attachCapacity(capacity);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.journeyRepository.save(journey);
  }
}
