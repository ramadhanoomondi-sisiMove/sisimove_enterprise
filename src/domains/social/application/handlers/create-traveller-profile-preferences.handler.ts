// src/domains/social/application/handlers/create-traveller-profile-preferences.handler.ts

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { CreateTravellerProfilePreferencesCommand } from '../commands/create-traveller-profile-preferences.command';

import { TravellerProfileNotFoundException } from '../../domain/exceptions';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { TravellerProfilePreferencesEntity } from '../../domain/entities/traveller-profile-preferences.entity';

import {
  TravellerProfileId,
  TravellerProfilePreferencesId,
} from '../../domain/value-objects';

export class CreateTravellerProfilePreferencesHandler implements CommandHandler<CreateTravellerProfilePreferencesCommand> {
  constructor(private readonly repository: TravellerProfileRepository) {}

  async execute(
    command: CreateTravellerProfilePreferencesCommand,
  ): Promise<void> {
    const profileId = new TravellerProfileId(command.travellerProfileId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TravellerProfileNotFoundException();
    }

    const preferences = TravellerProfilePreferencesEntity.create({
      publicId: new TravellerProfilePreferencesId(),

      profileId,

      showJourneyHistory: command.showJourneyHistory,

      showJourneyStatistics: command.showJourneyStatistics,

      allowJourneyInvites: command.allowJourneyInvites,

      createdAt: new Date(),
      updatedAt: new Date(),
    });

    aggregate.attachPreferences(
      preferences,
      command.correlationId,
      command.causationId,
    );

    await this.repository.save(aggregate);
  }
}
