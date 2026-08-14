// src/domains/social/application/commands/create-traveller-profile.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

import { TravellerProfileStatus } from '../../domain/value-objects/traveller-profile-status.vo';
import { TravellerProfileVisibility } from '../../domain/value-objects/traveller-profile-visibility.vo';

export class CreateTravellerProfileCommand extends Command {
  constructor(
    public readonly memberPublicId: string,
    public readonly handle: string,
    public readonly bio: string | null = null,
    public readonly avatarAssetPublicId: string | null = null,
    public readonly countryCode: string = 'KE',
    public readonly status: TravellerProfileStatus = TravellerProfileStatus.ACTIVE,
    public readonly visibility: TravellerProfileVisibility = TravellerProfileVisibility.PUBLIC,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
