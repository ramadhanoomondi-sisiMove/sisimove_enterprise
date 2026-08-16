// src/domains/journey/application/handlers/journey/expire-journey.handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { ExpireJourneyCommand } from '../../commands/journey/expire-journey.command';

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

export class ExpireJourneyHandler implements CommandHandler<ExpireJourneyCommand> {
  constructor(private readonly repository: JourneyRepository) {}

  async execute(command: ExpireJourneyCommand): Promise<void> {
    const journeyPublicId = new JourneyPublicId(command.journeyPublicId);

    const aggregate = await this.repository.findByPublicId(journeyPublicId);

    if (aggregate === null) {
      throw new JourneyNotFoundException();
    }

    aggregate.expire(
      command.correlationId,
      command.causationId,
      command.expiredAt ?? new Date(),
    );

    await this.repository.save(aggregate);
  }
}
