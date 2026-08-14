// src/domains/social/application/commands/remove-traveller-profile-preferences.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class RemoveTravellerProfilePreferencesCommand extends Command {
  constructor(
    public readonly travellerProfileId: string,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
