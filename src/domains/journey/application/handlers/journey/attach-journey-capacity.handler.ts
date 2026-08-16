// src/domains/journey/application/handlers/journey/attach-journey-capacity.handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { AttachJourneyCapacityCommand } from '../../commands/journey/attach-journey-capacity.command';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyNotFoundException } from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

export class AttachJourneyCapacityHandler implements CommandHandler<
  AttachJourneyCapacityCommand,
  void
> {
  constructor(private readonly journeyRepository: JourneyRepository) {}

  async execute(command: AttachJourneyCapacityCommand): Promise<void> {
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
    // Resolve Capacity
    // -------------------------------------------------------------------------

    const capacity = await this.journeyRepository.findCapacityByPublicId(
      journey.journeyId,
      command.capacityPublicId,
    );

    if (capacity === null) {
      throw new Error(
        `Journey capacity '${command.capacityPublicId.value}' was not found ` +
          `for Journey '${command.journeyPublicId.value}'.`,
      );
    }

    // -------------------------------------------------------------------------
    // Aggregate Mutation
    // -------------------------------------------------------------------------

    journey.attachCapacity(capacity);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.journeyRepository.save(journey);
  }
}
