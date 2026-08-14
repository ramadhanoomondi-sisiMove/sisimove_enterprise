// src/domains/social/application/handlers/change-traveller-profile-status.handler.ts

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { ChangeTravellerProfileStatusCommand } from '../commands/change-traveller-profile-status.command';

import { TravellerProfileNotFoundException } from '../../domain/exceptions';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { TravellerProfileId } from '../../domain/value-objects/traveller-profile-id.vo';

export class ChangeTravellerProfileStatusHandler implements CommandHandler<ChangeTravellerProfileStatusCommand> {
  constructor(private readonly repository: TravellerProfileRepository) {}

  async execute(command: ChangeTravellerProfileStatusCommand): Promise<void> {
    const aggregate = await this.repository.findById(
      new TravellerProfileId(command.travellerProfileId),
    );

    if (aggregate === null) {
      throw new TravellerProfileNotFoundException();
    }

    aggregate.changeStatus(
      command.status,
      command.correlationId,
      command.causationId,
    );

    await this.repository.save(aggregate);
  }
}
