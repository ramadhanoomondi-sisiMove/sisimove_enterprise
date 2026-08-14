// src/domains/social/application/handlers/change-traveller-profile-preferences.handler.ts

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { ChangeTravellerProfilePreferencesCommand } from '../commands/change-traveller-profile-preferences.command';

import {
  TravellerProfileNotFoundException,
  TravellerProfilePreferencesNotFoundException,
} from '../../domain/exceptions';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { TravellerProfileId } from '../../domain/value-objects/traveller-profile-id.vo';

export class ChangeTravellerProfilePreferencesHandler implements CommandHandler<ChangeTravellerProfilePreferencesCommand> {
  constructor(private readonly repository: TravellerProfileRepository) {}

  async execute(
    command: ChangeTravellerProfilePreferencesCommand,
  ): Promise<void> {
    const profileId = new TravellerProfileId(command.travellerProfileId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TravellerProfileNotFoundException();
    }

    if (aggregate.preferences === undefined) {
      throw new TravellerProfilePreferencesNotFoundException();
    }

    aggregate.changePreferences(
      command.showJourneyHistory,
      command.showJourneyStatistics,
      command.allowJourneyInvites,
      command.correlationId,
      command.causationId,
    );

    await this.repository.save(aggregate);
  }
}
