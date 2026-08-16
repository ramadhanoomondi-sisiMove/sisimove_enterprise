// src/domains/journey/application/handlers/journey/complete-journey.handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { CompleteJourneyCommand } from '../../commands/journey/complete-journey.command';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyNotFoundException } from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { JourneyPublicId } from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

export class CompleteJourneyHandler implements CommandHandler<CompleteJourneyCommand> {
  constructor(private readonly repository: JourneyRepository) {}

  async execute(command: CompleteJourneyCommand): Promise<void> {
    const journeyPublicId = new JourneyPublicId(command.journeyPublicId);

    const aggregate = await this.repository.findByPublicId(journeyPublicId);

    if (aggregate === null) {
      throw new JourneyNotFoundException();
    }

    aggregate.complete(
      command.correlationId,
      command.causationId,
      command.completedAt ?? new Date(),
    );

    await this.repository.save(aggregate);
  }
}
