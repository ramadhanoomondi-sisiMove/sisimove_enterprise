// src/domains/social/application/handlers/remove-traveller-profile-preferences.handler.ts

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { RemoveTravellerProfilePreferencesCommand } from '../commands/remove-traveller-profile-preferences.command';

import { TravellerProfileNotFoundException } from '../../domain/exceptions';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { TravellerProfileId } from '../../domain/value-objects/traveller-profile-id.vo';

export class RemoveTravellerProfilePreferencesHandler implements CommandHandler<RemoveTravellerProfilePreferencesCommand> {
  constructor(private readonly repository: TravellerProfileRepository) {}

  async execute(
    command: RemoveTravellerProfilePreferencesCommand,
  ): Promise<void> {
    const profileId = new TravellerProfileId(command.travellerProfileId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TravellerProfileNotFoundException();
    }

    aggregate.removePreferences();

    await this.repository.save(aggregate);
  }
}
