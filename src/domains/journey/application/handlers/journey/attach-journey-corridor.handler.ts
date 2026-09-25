// src/domains/journey/application/handlers/journey/attach-journey-corridor.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Corridor Command Handler
// -----------------------------------------------------------------------------
//
// Application-layer command handler for configuring the corridor of a Journey.
//
// Responsibilities:
// - resolve the Journey aggregate;
// - create a new Journey Corridor child entity from command data;
// - attach the corridor to the Journey aggregate;
// - persist the mutated aggregate.
//
// The handler does NOT:
// - access Prisma directly;
// - perform HTTP concerns;
// - mutate persistence models;
// - implement Journey business rules.
//
// Journey owns the corridor child and its attachment relationship.
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

import type { AttachJourneyCorridorCommand } from '../../commands/journey/attach-journey-corridor.command';

// -----------------------------------------------------------------------------
// Domain — Entity
// -----------------------------------------------------------------------------

import { JourneyCorridorEntity } from '../../../domain/entities/journey-corridor.entity';

// -----------------------------------------------------------------------------
// Domain — Exceptions
// -----------------------------------------------------------------------------

import { JourneyNotFoundException } from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyCorridorPublicId,
  JourneyLatitude,
  JourneyLocationName,
  JourneyLongitude,
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
export class AttachJourneyCorridorHandler implements CommandHandler<
  AttachJourneyCorridorCommand,
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

  public async execute(command: AttachJourneyCorridorCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    //
    // The command already contains JourneyPublicId as a Value Object.
    // Do not reconstruct it here.
    // -------------------------------------------------------------------------

    const aggregate = await this.journeyRepository.findByPublicId(
      command.journeyPublicId,
    );

    if (aggregate === null) {
      throw new JourneyNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Create Corridor
    //
    // JourneyCorridor is a Journey-owned child entity.
    //
    // The public ID is generated here because this command creates a new
    // corridor rather than attaching an existing corridor.
    //
    // corridorKey is intentionally undefined at creation time. It is an
    // optional derived/domain value and can be assigned later through the
    // JourneyCorridorEntity mutation API when appropriate.
    //
    // Waypoints start empty because they are added through the Journey
    // aggregate after the corridor has been attached.
    // -------------------------------------------------------------------------

    const now = new Date();

    const corridor = JourneyCorridorEntity.create({
      publicId: new JourneyCorridorPublicId(),

      originName: new JourneyLocationName(command.originName),
      destinationName: new JourneyLocationName(command.destinationName),

      originLatitude: new JourneyLatitude(command.originLatitude),
      originLongitude: new JourneyLongitude(command.originLongitude),

      destinationLatitude: new JourneyLatitude(command.destinationLatitude),
      destinationLongitude: new JourneyLongitude(command.destinationLongitude),

      corridorKey: undefined,

      waypoints: [],

      createdAt: now,
      updatedAt: now,
    });

    // -------------------------------------------------------------------------
    // Aggregate Mutation
    //
    // Journey owns the corridor attachment relationship.
    // -------------------------------------------------------------------------

    aggregate.attachCorridor(corridor);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.journeyRepository.save(aggregate);
  }
}
