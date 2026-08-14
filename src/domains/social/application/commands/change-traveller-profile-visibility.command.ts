// src/domains/social/application/commands/change-traveller-profile-visibility.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

import type { TravellerProfileVisibility } from '../../domain/value-objects/traveller-profile-visibility.vo';

export class ChangeTravellerProfileVisibilityCommand extends Command {
  constructor(
    public readonly travellerProfileId: string,
    public readonly visibility: TravellerProfileVisibility,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
