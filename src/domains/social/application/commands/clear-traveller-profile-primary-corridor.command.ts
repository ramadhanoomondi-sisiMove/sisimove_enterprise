// src/domains/social/application/commands/clear-traveller-profile-primary-corridor.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class ClearTravellerProfilePrimaryCorridorCommand extends Command {
  constructor(
    public readonly travellerProfileId: string,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
