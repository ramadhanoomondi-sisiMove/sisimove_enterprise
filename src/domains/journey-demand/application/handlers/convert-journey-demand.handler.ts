// src/domains/journey-demand/application/handlers/convert-journey-demand.handler.ts

// -----------------------------------------------------------------------------
// Journey Demand — Convert Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { ConvertJourneyDemandCommand } from '../commands/convert-journey-demand.command';

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

import { JourneyDemandPublicId } from '../../domain/value-objects/journey-demand-public-id.vo';

import { MatchedJourneyPublicId } from '../../domain/value-objects/matched-journey-public-id.vo';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

export class ConvertJourneyDemandHandler implements CommandHandler<ConvertJourneyDemandCommand> {
  constructor(private readonly repository: JourneyDemandRepository) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  async execute(command: ConvertJourneyDemandCommand): Promise<void> {
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
    // Matched Journey Identity
    // -------------------------------------------------------------------------

    const journeyPublicId = new MatchedJourneyPublicId(command.journeyPublicId);

    // -------------------------------------------------------------------------
    // Convert
    // -------------------------------------------------------------------------

    aggregate.convert(
      journeyPublicId,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);
  }
}
