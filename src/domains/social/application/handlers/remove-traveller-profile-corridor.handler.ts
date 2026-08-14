// src/domains/social/application/handlers/remove-traveller-profile-corridor.handler.ts

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { RemoveTravellerProfileCorridorCommand } from '../commands/remove-traveller-profile-corridor.command';

import { TravellerProfileNotFoundException } from '../../domain/exceptions';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import {
  TravellerProfileCorridorId,
  TravellerProfileId,
} from '../../domain/value-objects';

export class RemoveTravellerProfileCorridorHandler implements CommandHandler<RemoveTravellerProfileCorridorCommand> {
  constructor(private readonly repository: TravellerProfileRepository) {}

  async execute(command: RemoveTravellerProfileCorridorCommand): Promise<void> {
    const profileId = new TravellerProfileId(command.travellerProfileId);

    const corridorId = new TravellerProfileCorridorId(command.corridorId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TravellerProfileNotFoundException();
    }

    aggregate.removeCorridor(
      corridorId,
      command.correlationId,
      command.causationId,
    );

    await this.repository.save(aggregate);
  }
}
