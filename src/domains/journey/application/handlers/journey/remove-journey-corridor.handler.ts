// src/domains/journey/application/handlers/journey/remove-journey-corridor.handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';
import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { RemoveJourneyCorridorCommand } from '../../commands/journey/remove-corridor.command';

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
// Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_TOKENS } from '../../journey.tokens';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class RemoveJourneyCorridorHandler implements CommandHandler<RemoveJourneyCorridorCommand> {
  constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly repository: JourneyRepository,
  ) {}

  async execute(command: RemoveJourneyCorridorCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Resolve Journey Public ID
    // -------------------------------------------------------------------------

    const journeyPublicId = new JourneyPublicId(command.journeyPublicId);

    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(journeyPublicId);

    if (aggregate === null) {
      throw new JourneyNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Aggregate Mutation
    // -------------------------------------------------------------------------

    aggregate.removeCorridor();

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);
  }
}
