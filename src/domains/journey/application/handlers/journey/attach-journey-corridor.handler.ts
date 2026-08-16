// src/domains/journey/application/handlers/journey/attach-journey-corridor.handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { AttachJourneyCorridorCommand } from '../../commands/journey/attach-journey-corridor.command';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import {
  JourneyInvalidCorridorException,
  JourneyNotFoundException,
} from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

export class AttachJourneyCorridorHandler implements CommandHandler<
  AttachJourneyCorridorCommand,
  void
> {
  constructor(private readonly journeyRepository: JourneyRepository) {}

  async execute(command: AttachJourneyCorridorCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    //
    // Command already contains JourneyPublicId as a Value Object.
    // Do NOT construct another JourneyPublicId here.
    // -------------------------------------------------------------------------

    const aggregate = await this.journeyRepository.findByPublicId(
      command.journeyPublicId,
    );

    if (aggregate === null) {
      throw new JourneyNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Resolve Corridor
    //
    // Corridor lookup is scoped to the Journey aggregate.
    // The command already contains JourneyCorridorPublicId as a Value Object.
    // -------------------------------------------------------------------------

    const corridor = await this.journeyRepository.findCorridorByPublicId(
      aggregate.journeyId,
      command.corridorPublicId,
    );

    if (corridor === null) {
      throw new JourneyInvalidCorridorException(
        `Journey corridor '${command.corridorPublicId.value}' ` +
          `was not found for Journey '${command.journeyPublicId.value}'.`,
      );
    }

    // -------------------------------------------------------------------------
    // Aggregate Mutation
    // -------------------------------------------------------------------------

    aggregate.attachCorridor(corridor);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.journeyRepository.save(aggregate);
  }
}
