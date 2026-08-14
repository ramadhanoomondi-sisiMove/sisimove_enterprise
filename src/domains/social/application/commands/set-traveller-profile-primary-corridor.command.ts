// src/domains/social/application/commands/set-traveller-profile-primary-corridor.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class SetTravellerProfilePrimaryCorridorCommand extends Command {
  constructor(
    public readonly travellerProfileId: string,
    public readonly corridorId: string,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
