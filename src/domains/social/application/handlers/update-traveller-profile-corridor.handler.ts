// src/domains/social/application/handlers/update-traveller-profile-corridor.handler.ts

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { UpdateTravellerProfileCorridorCommand } from '../commands/update-traveller-profile-corridor.command';

import {
  TravellerProfileCorridorNotFoundException,
  TravellerProfileNotFoundException,
} from '../../domain/exceptions';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import {
  CorridorKey,
  TravellerProfileCorridorId,
  TravellerProfileId,
} from '../../domain/value-objects';

export class UpdateTravellerProfileCorridorHandler implements CommandHandler<UpdateTravellerProfileCorridorCommand> {
  constructor(private readonly repository: TravellerProfileRepository) {}

  async execute(command: UpdateTravellerProfileCorridorCommand): Promise<void> {
    const profileId = new TravellerProfileId(command.travellerProfileId);

    const corridorId = new TravellerProfileCorridorId(command.corridorId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TravellerProfileNotFoundException();
    }

    const corridor = aggregate.getCorridorById(corridorId);

    if (corridor === undefined) {
      throw new TravellerProfileCorridorNotFoundException();
    }

    corridor.setOriginName(command.originName.trim());
    corridor.setDestinationName(command.destinationName.trim());

    corridor.setOriginCoordinates(
      command.originLatitude,
      command.originLongitude,
    );

    corridor.setDestinationCoordinates(
      command.destinationLatitude,
      command.destinationLongitude,
    );

    corridor.setCorridorKey(new CorridorKey(command.corridorKey));

    corridor.setUpdatedAt(new Date());

    aggregate.updateCorridor(
      corridorId,
      command.correlationId,
      command.causationId,
    );

    await this.repository.save(aggregate);
  }
}
