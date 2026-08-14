// src/domains/social/application/commands/change-traveller-profile-status.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

import type { TravellerProfileStatus } from '../../domain/value-objects/traveller-profile-status.vo';

export class ChangeTravellerProfileStatusCommand extends Command {
  constructor(
    public readonly travellerProfileId: string,
    public readonly status: TravellerProfileStatus,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
