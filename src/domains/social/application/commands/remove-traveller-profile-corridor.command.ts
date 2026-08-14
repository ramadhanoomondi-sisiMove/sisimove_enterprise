// src/domains/social/application/commands/remove-traveller-profile-corridor.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class RemoveTravellerProfileCorridorCommand extends Command {
  constructor(
    public readonly travellerProfileId: string,
    public readonly corridorId: string,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
