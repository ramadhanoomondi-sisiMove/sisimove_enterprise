// src/domains/journey-demand/application/handlers/publish-journey-demand.handler.ts

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { PublishJourneyDemandCommand } from '../commands/publish-journey-demand.command';

import { JourneyDemandNotFoundException } from '../../domain/exceptions';

import type { JourneyDemandRepository } from '../../domain/repositories/journey-demand.repository';

import { JourneyDemandPublicId } from '../../domain/value-objects';

export class PublishJourneyDemandHandler implements CommandHandler<PublishJourneyDemandCommand> {
  constructor(private readonly repository: JourneyDemandRepository) {}

  async execute(command: PublishJourneyDemandCommand): Promise<void> {
    const journeyDemandPublicId = new JourneyDemandPublicId(
      command.journeyDemandPublicId,
    );

    const aggregate = await this.repository.findByPublicId(
      journeyDemandPublicId,
    );

    if (aggregate === null) {
      throw new JourneyDemandNotFoundException();
    }

    aggregate.publish(command.correlationId, command.causationId);

    await this.repository.save(aggregate);
  }
}
