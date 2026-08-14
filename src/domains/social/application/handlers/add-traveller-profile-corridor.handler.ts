// src/domains/social/application/handlers/add-traveller-profile-corridor.handler.ts

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { AddTravellerProfileCorridorCommand } from '../commands/add-traveller-profile-corridor.command';

import { TravellerProfileNotFoundException } from '../../domain/exceptions';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { TravellerProfileCorridorEntity } from '../../domain/entities/traveller-profile-corridor.entity';

import {
  CorridorKey,
  TravellerProfileCorridorId,
  TravellerProfileId,
} from '../../domain/value-objects';

export class AddTravellerProfileCorridorHandler implements CommandHandler<AddTravellerProfileCorridorCommand> {
  constructor(private readonly repository: TravellerProfileRepository) {}

  async execute(command: AddTravellerProfileCorridorCommand): Promise<void> {
    const profileId = new TravellerProfileId(command.travellerProfileId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TravellerProfileNotFoundException();
    }

    const corridor = TravellerProfileCorridorEntity.create({
      publicId: new TravellerProfileCorridorId(),

      profileId,

      originName: command.originName.trim(),
      destinationName: command.destinationName.trim(),

      originLatitude: command.originLatitude,
      originLongitude: command.originLongitude,

      destinationLatitude: command.destinationLatitude,
      destinationLongitude: command.destinationLongitude,

      corridorKey: new CorridorKey(command.corridorKey),

      isPrimary: command.isPrimary,

      createdAt: new Date(),
      updatedAt: new Date(),
    });

    aggregate.addCorridor(corridor, command.correlationId, command.causationId);

    await this.repository.save(aggregate);
  }
}
