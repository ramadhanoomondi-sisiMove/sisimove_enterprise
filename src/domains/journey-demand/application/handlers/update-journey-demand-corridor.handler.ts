// src/domains/journey-demand/application/handlers/update-journey-demand-corridor.handler.ts

// -----------------------------------------------------------------------------
// Journey Demand — Update Corridor Handler
// -----------------------------------------------------------------------------
//
// Responsibilities
// ----------------
// 1. Load the Journey Demand aggregate.
// 2. Create the corridor when this is the first corridor configuration.
// 3. Attach the newly-created corridor to the aggregate.
// 4. Update the existing corridor when one is already attached.
// 5. Persist the complete aggregate.
//
// Architectural boundary
// ----------------------
// - The handler creates the child entity.
// - The aggregate owns attachment and mutation of the child.
// - The repository persists the complete aggregate.
// - Domain value objects are created here from command primitives.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Dependency Injection
// -----------------------------------------------------------------------------

import { Inject } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { UpdateJourneyDemandCorridorCommand } from '../commands/update-journey-demand-corridor.command';

// -----------------------------------------------------------------------------
// Dependency Injection Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_DEMAND_TOKENS } from '../journey-demand.tokens';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { JourneyDemandNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Domain Repository
// -----------------------------------------------------------------------------

import type { JourneyDemandRepository } from '../../domain/repositories/journey-demand.repository';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import { JourneyDemandCorridorEntity } from '../../domain/entities/journey-demand-corridor.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyDemandCoordinate,
  JourneyDemandLocation,
  JourneyDemandPublicId,
  JourneyDemandCorridorPublicId,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

export class UpdateJourneyDemandCorridorHandler implements CommandHandler<UpdateJourneyDemandCorridorCommand> {
  constructor(
    @Inject(JOURNEY_DEMAND_TOKENS.REPOSITORY)
    private readonly repository: JourneyDemandRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  async execute(command: UpdateJourneyDemandCorridorCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Journey Demand Identity
    // -------------------------------------------------------------------------

    const journeyDemandPublicId = new JourneyDemandPublicId(
      command.journeyDemandPublicId,
    );

    // -------------------------------------------------------------------------
    // Load Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      journeyDemandPublicId,
    );

    if (aggregate === null) {
      throw new JourneyDemandNotFoundException(command.journeyDemandPublicId);
    }

    // -------------------------------------------------------------------------
    // Initial Corridor Attachment
    // -------------------------------------------------------------------------
    //
    // A newly-created Journey Demand does not necessarily have a corridor.
    //
    // JourneyDemandCorridorEntity requires:
    // - origin name
    // - destination name
    // - origin coordinates
    // - destination coordinates
    //
    // The application layer therefore creates the child entity and then
    // attaches it to the aggregate.
    // -------------------------------------------------------------------------

    if (!aggregate.hasCorridor()) {
      const corridor = JourneyDemandCorridorEntity.create({
        publicId: new JourneyDemandCorridorPublicId(),

        originName: new JourneyDemandLocation(command.origin),

        destinationName: new JourneyDemandLocation(command.destination),

        originCoordinates: new JourneyDemandCoordinate(
          command.originLatitude,
          command.originLongitude,
        ),

        destinationCoordinates: new JourneyDemandCoordinate(
          command.destinationLatitude,
          command.destinationLongitude,
        ),

        waypoints: [],
      });

      // -----------------------------------------------------------------------
      // Attach Child Entity to Aggregate
      // -----------------------------------------------------------------------

      aggregate.attachCorridor(corridor);

      // -----------------------------------------------------------------------
      // Persist Complete Aggregate
      // -----------------------------------------------------------------------

      await this.repository.save(aggregate);

      return;
    }

    // -------------------------------------------------------------------------
    // Existing Corridor Update
    // -------------------------------------------------------------------------
    //
    // Once the corridor exists, the aggregate owns the mutation.
    // Do not replace the child entity from the handler.
    // -------------------------------------------------------------------------

    aggregate.updateCorridor(
      command.origin,
      command.destination,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // Persist Complete Aggregate
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);
  }
}
