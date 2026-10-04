// src/domains/journey-demand/application/handlers/update-journey-demand-capacity.handler.ts

// -----------------------------------------------------------------------------
// Journey Demand — Update Capacity Handler
// -----------------------------------------------------------------------------
//
// Responsibilities
// ----------------
// 1. Load the Journey Demand aggregate.
// 2. Create the capacity child entity when this is the first capacity
//    configuration.
// 3. Attach the newly-created capacity entity to the aggregate.
// 4. Update the existing capacity through the aggregate when capacity already
//    exists.
// 5. Persist the complete aggregate.
//
// Architectural boundary
// ----------------------
// - The application handler creates child entities.
// - The aggregate owns child attachment.
// - The aggregate owns mutation of an existing child.
// - The repository persists the complete aggregate.
// - Domain value objects are constructed from command primitives here.
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

import type { UpdateJourneyDemandCapacityCommand } from '../commands/update-journey-demand-capacity.command';

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

import { JourneyDemandCapacityEntity } from '../../domain/entities/journey-demand-capacity.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyDemandCapacityPublicId,
  JourneyDemandPublicId,
  JourneyDemandSeats,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

export class UpdateJourneyDemandCapacityHandler implements CommandHandler<UpdateJourneyDemandCapacityCommand> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    @Inject(JOURNEY_DEMAND_TOKENS.REPOSITORY)
    private readonly repository: JourneyDemandRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  async execute(command: UpdateJourneyDemandCapacityCommand): Promise<void> {
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
    // Initial Capacity Attachment
    // -------------------------------------------------------------------------
    //
    // A newly-created Journey Demand may not have a capacity child yet.
    //
    // The application layer creates the child entity because the aggregate
    // should orchestrate its children rather than construct infrastructure
    // entities itself.
    // -------------------------------------------------------------------------

    if (!aggregate.hasCapacity()) {
      const requestedSeats = new JourneyDemandSeats(command.seatsRequired);

      const capacity = JourneyDemandCapacityEntity.create({
        publicId: new JourneyDemandCapacityPublicId(),
        requestedSeats,
        matchedSeats: 0,
      });

      // -----------------------------------------------------------------------
      // Attach Child Entity to Aggregate
      // -----------------------------------------------------------------------

      aggregate.attachCapacity(capacity);

      // -----------------------------------------------------------------------
      // Persist Complete Aggregate
      // -----------------------------------------------------------------------

      await this.repository.save(aggregate);

      return;
    }

    // -------------------------------------------------------------------------
    // Existing Capacity Update
    // -------------------------------------------------------------------------
    //
    // Once the capacity child exists, mutation belongs to the aggregate.
    // The handler must not replace the existing child entity.
    // -------------------------------------------------------------------------

    aggregate.updateCapacity(
      command.seatsRequired,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // Persist Complete Aggregate
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);
  }
}
