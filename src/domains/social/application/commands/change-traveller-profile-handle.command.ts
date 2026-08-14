// src/domains/social/application/commands/change-traveller-profile-handle.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class ChangeTravellerProfileHandleCommand extends Command {
  constructor(
    public readonly travellerProfileId: string,
    public readonly handle: string,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
