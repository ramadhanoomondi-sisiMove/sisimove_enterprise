// src/domains/social/application/commands/change-traveller-profile-preferences.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class ChangeTravellerProfilePreferencesCommand extends Command {
  constructor(
    public readonly travellerProfileId: string,
    public readonly showJourneyHistory: boolean,
    public readonly showJourneyStatistics: boolean,
    public readonly allowJourneyInvites: boolean,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
