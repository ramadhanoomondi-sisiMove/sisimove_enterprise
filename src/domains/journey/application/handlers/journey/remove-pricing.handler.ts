// src/domains/journey/application/handlers/journey/remove-pricing.handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { RemovePricingCommand } from '../../commands/journey/remove-pricing.command';

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

import { JourneyPublicId } from '../../../domain/value-objects/journey-public-id.vo';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

export class RemovePricingHandler implements CommandHandler<RemovePricingCommand> {
  constructor(private readonly repository: JourneyRepository) {}

  async execute(command: RemovePricingCommand): Promise<void> {
    const journeyPublicId = new JourneyPublicId(command.journeyPublicId);

    const aggregate = await this.repository.findByPublicId(journeyPublicId);

    if (aggregate === null) {
      throw new JourneyNotFoundException();
    }

    aggregate.removePricing();

    await this.repository.save(aggregate);
  }
}
