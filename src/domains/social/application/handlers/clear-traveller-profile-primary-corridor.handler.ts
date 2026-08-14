// src/domains/social/application/handlers/clear-traveller-profile-primary-corridor.handler.ts

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { ClearTravellerProfilePrimaryCorridorCommand } from '../commands/clear-traveller-profile-primary-corridor.command';

import { TravellerProfileNotFoundException } from '../../domain/exceptions';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { TravellerProfileId } from '../../domain/value-objects/traveller-profile-id.vo';

export class ClearTravellerProfilePrimaryCorridorHandler implements CommandHandler<ClearTravellerProfilePrimaryCorridorCommand> {
  constructor(private readonly repository: TravellerProfileRepository) {}

  async execute(
    command: ClearTravellerProfilePrimaryCorridorCommand,
  ): Promise<void> {
    const profileId = new TravellerProfileId(command.travellerProfileId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TravellerProfileNotFoundException();
    }

    aggregate.clearPrimaryCorridor();

    await this.repository.save(aggregate);
  }
}
