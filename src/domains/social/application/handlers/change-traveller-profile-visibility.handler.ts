// src/domains/social/application/handlers/change-traveller-profile-visibility.handler.ts

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { ChangeTravellerProfileVisibilityCommand } from '../commands/change-traveller-profile-visibility.command';

import { TravellerProfileNotFoundException } from '../../domain/exceptions';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { TravellerProfileId } from '../../domain/value-objects/traveller-profile-id.vo';

export class ChangeTravellerProfileVisibilityHandler implements CommandHandler<ChangeTravellerProfileVisibilityCommand> {
  constructor(private readonly repository: TravellerProfileRepository) {}

  async execute(
    command: ChangeTravellerProfileVisibilityCommand,
  ): Promise<void> {
    const aggregate = await this.repository.findById(
      new TravellerProfileId(command.travellerProfileId),
    );

    if (aggregate === null) {
      throw new TravellerProfileNotFoundException();
    }

    aggregate.changeVisibility(
      command.visibility,
      command.correlationId,
      command.causationId,
    );

    await this.repository.save(aggregate);
  }
}
