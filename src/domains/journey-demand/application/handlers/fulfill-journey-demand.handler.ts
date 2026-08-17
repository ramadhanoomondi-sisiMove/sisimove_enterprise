// src/domains/journey-demand/application/handlers/fulfill-journey-demand.handler.ts

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { FulfillJourneyDemandCommand } from '../commands/fulfill-journey-demand.command';

import { JourneyDemandNotFoundException } from '../../domain/exceptions';

import type { JourneyDemandRepository } from '../../domain/repositories/journey-demand.repository';

import { JourneyDemandPublicId } from '../../domain/value-objects';

export class FulfillJourneyDemandHandler implements CommandHandler<FulfillJourneyDemandCommand> {
  constructor(private readonly repository: JourneyDemandRepository) {}

  async execute(command: FulfillJourneyDemandCommand): Promise<void> {
    const journeyDemandPublicId = new JourneyDemandPublicId(
      command.journeyDemandPublicId,
    );

    const aggregate = await this.repository.findByPublicId(
      journeyDemandPublicId,
    );

    if (aggregate === null) {
      throw new JourneyDemandNotFoundException();
    }

    aggregate.fulfill(command.correlationId, command.causationId);

    await this.repository.save(aggregate);
  }
}
