// src/domains/journey-demand/application/handlers/update-journey-demand.handler.ts

// -----------------------------------------------------------------------------
// Update Journey Demand Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { UpdateJourneyDemandCommand } from '../commands/update-journey-demand.command';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyDemandNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyDemandRepository } from '../../domain/repositories/journey-demand.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { JourneyDemandPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

export class UpdateJourneyDemandHandler implements CommandHandler<UpdateJourneyDemandCommand> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly repository: JourneyDemandRepository) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(command: UpdateJourneyDemandCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Resolve Aggregate Identity
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
      throw new JourneyDemandNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Record Root Aggregate Update
    //
    // The JourneyDemandAggregate exposes recordUpdated(), not update().
    //
    // recordUpdated() is responsible for:
    //
    // - updating the aggregate audit timestamp
    // - incrementing the aggregate version
    // - recording JourneyDemandUpdatedEvent
    // -------------------------------------------------------------------------

    aggregate.recordUpdated(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);
  }
}
