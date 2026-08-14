// src/domains/social/application/commands/change-traveller-profile-country.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class ChangeTravellerProfileCountryCommand extends Command {
  constructor(
    public readonly travellerProfileId: string,
    public readonly countryCode: string,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
