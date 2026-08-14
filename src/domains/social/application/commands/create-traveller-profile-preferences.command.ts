// src/domains/social/application/commands/create-traveller-profile-preferences.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class CreateTravellerProfilePreferencesCommand extends Command {
  constructor(
    public readonly travellerProfileId: string,
    public readonly showJourneyHistory: boolean = true,
    public readonly showJourneyStatistics: boolean = true,
    public readonly allowJourneyInvites: boolean = true,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
