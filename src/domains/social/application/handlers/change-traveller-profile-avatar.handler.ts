// -----------------------------------------------------------------------------
// sisiMove — Change Traveller Profile Avatar Handler
// -----------------------------------------------------------------------------
//
// Application command handler for changing a Traveller Profile avatar.
//
// Authorization boundary:
//
// - HTTP layer authenticates the caller through JwtAuthGuard.
// - The command carries the authenticated Identity public ID.
// - Ownership must be verified by the application layer.
// - No RBAC permission is required for changing one's own avatar.
//
// Dependency injection:
//
// - TravellerProfileRepository is a domain abstraction.
// - Because it is a TypeScript interface, Nest cannot inject it by type.
// - TRAVELLER_PROFILE_TOKENS.REPOSITORY is therefore used explicitly.
//
// -----------------------------------------------------------------------------

import { Inject } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { ChangeTravellerProfileAvatarCommand } from '../commands/change-traveller-profile-avatar.command';

import { TRAVELLER_PROFILE_TOKENS } from '../traveller-profile.tokens';

import { TravellerProfileNotFoundException } from '../../domain/exceptions';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { AvatarAssetPublicId } from '../../domain/value-objects/avatar-asset-public-id.vo';
import { TravellerProfileId } from '../../domain/value-objects/traveller-profile-id.vo';

// =============================================================================
// Change Traveller Profile Avatar Handler
// =============================================================================

export class ChangeTravellerProfileAvatarHandler implements CommandHandler<ChangeTravellerProfileAvatarCommand> {
  constructor(
    @Inject(TRAVELLER_PROFILE_TOKENS.REPOSITORY)
    private readonly repository: TravellerProfileRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

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
