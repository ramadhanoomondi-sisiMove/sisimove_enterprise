// src/domains/social/application/commands/change-traveller-profile-bio.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class ChangeTravellerProfileBioCommand extends Command {
  constructor(
    public readonly travellerProfileId: string,
    public readonly bio: string | null,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
