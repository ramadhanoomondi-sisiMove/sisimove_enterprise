// src/domains/journey-demand/application/handlers/update-journey-demand-corridor.handler.ts

// -----------------------------------------------------------------------------
// Journey Demand — Update Corridor Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { UpdateJourneyDemandCorridorCommand } from '../commands/update-journey-demand-corridor.command';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { JourneyDemandNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Domain Repository
// -----------------------------------------------------------------------------

import type { JourneyDemandRepository } from '../../domain/repositories/journey-demand.repository';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { JourneyDemandPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

export class UpdateJourneyDemandCorridorHandler implements CommandHandler<UpdateJourneyDemandCorridorCommand> {
  constructor(private readonly repository: JourneyDemandRepository) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

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
    // Update Corridor
    // -------------------------------------------------------------------------

    aggregate.updateCorridor(
      command.origin,
      command.destination,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);
  }
}
