// src/domains/social/application/commands/change-traveller-profile-avatar.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class ChangeTravellerProfileAvatarCommand extends Command {
  constructor(
    public readonly travellerProfileId: string,
    public readonly avatarAssetPublicId: string | null,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
