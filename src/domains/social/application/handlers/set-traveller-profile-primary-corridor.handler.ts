// src/domains/social/application/handlers/set-traveller-profile-primary-corridor.handler.ts

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { SetTravellerProfilePrimaryCorridorCommand } from '../commands/set-traveller-profile-primary-corridor.command';

import { TravellerProfileNotFoundException } from '../../domain/exceptions';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import {
  TravellerProfileCorridorId,
  TravellerProfileId,
} from '../../domain/value-objects';

export class SetTravellerProfilePrimaryCorridorHandler implements CommandHandler<SetTravellerProfilePrimaryCorridorCommand> {
  constructor(private readonly repository: TravellerProfileRepository) {}

  async execute(
    command: SetTravellerProfilePrimaryCorridorCommand,
  ): Promise<void> {
    const profileId = new TravellerProfileId(command.travellerProfileId);

    const corridorId = new TravellerProfileCorridorId(command.corridorId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TravellerProfileNotFoundException();
    }

    aggregate.setPrimaryCorridor(
      corridorId,
      command.correlationId,
      command.causationId,
    );

    await this.repository.save(aggregate);
  }
}
