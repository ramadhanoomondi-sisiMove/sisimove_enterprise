// src/domains/social/application/handlers/change-traveller-profile-avatar.handler.ts

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { ChangeTravellerProfileAvatarCommand } from '../commands/change-traveller-profile-avatar.command';

import { TravellerProfileNotFoundException } from '../../domain/exceptions';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { AvatarAssetPublicId } from '../../domain/value-objects/avatar-asset-public-id.vo';
import { TravellerProfileId } from '../../domain/value-objects/traveller-profile-id.vo';

export class ChangeTravellerProfileAvatarHandler implements CommandHandler<ChangeTravellerProfileAvatarCommand> {
  constructor(private readonly repository: TravellerProfileRepository) {}

  async execute(command: ChangeTravellerProfileAvatarCommand): Promise<void> {
    const aggregate = await this.repository.findById(
      new TravellerProfileId(command.travellerProfileId),
    );

    if (aggregate === null) {
      throw new TravellerProfileNotFoundException();
    }

    const avatarAssetPublicId =
      command.avatarAssetPublicId === null
        ? undefined
        : new AvatarAssetPublicId(command.avatarAssetPublicId);

    aggregate.setAvatar(
      avatarAssetPublicId,
      command.correlationId,
      command.causationId,
    );

    await this.repository.save(aggregate);
  }
}
