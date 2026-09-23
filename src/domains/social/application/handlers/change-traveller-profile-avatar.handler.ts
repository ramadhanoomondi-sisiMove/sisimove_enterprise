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
// - The application layer verifies that the requested Traveller Profile
//   belongs to the authenticated member.
// - No RBAC permission is required for changing one's own avatar.
//
// Traveller Profile identification:
//
// - `command.travellerProfileId` is a TravellerProfilePublicId.
// - It MUST be resolved with findByPublicId().
// - It MUST NOT be passed to findById(), which expects the internal domain ID.
//
// Asset identification:
//
// - `avatarAssetPublicId` is an Asset public identifier.
// - TravellerProfile stores the identifier as an opaque Asset reference.
// - Asset ownership and delivery remain within the Asset bounded context.
//
// -----------------------------------------------------------------------------

import { Inject } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { ChangeTravellerProfileAvatarCommand } from '../commands/change-traveller-profile-avatar.command';

import { TRAVELLER_PROFILE_TOKENS } from '../traveller-profile.tokens';

import { TravellerProfileNotFoundException } from '../../domain/exceptions';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { AvatarAssetPublicId } from '../../domain/value-objects/avatar-asset-public-id.vo';
import { TravellerProfilePublicId } from '../../domain/value-objects/traveller-profile-public-id.vo';

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
    // -------------------------------------------------------------------------
    // Resolve the requested Traveller Profile using its PUBLIC identifier.
    //
    // Example:
    //
    //     TPR-PKXTFUK
    //
    // This is deliberately not resolved through findById(), because findById()
    // expects the internal TravellerProfileId.
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      new TravellerProfilePublicId(command.travellerProfileId),
    );

    if (aggregate === null) {
      throw new TravellerProfileNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Verify ownership.
    //
    // The client-provided Traveller Profile public ID is not proof of
    // ownership. The authenticated identity supplied by JwtAuthGuard is.
    //
    // The existing Traveller Profile boundary uses the authenticated identity
    // public identifier as the member public identifier.
    // -------------------------------------------------------------------------

    if (aggregate.memberPublicId.toString() !== command.identityPublicId) {
      throw new TravellerProfileNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Convert the Asset public identifier into its domain value object.
    //
    // `null` means that the current avatar should be removed.
    // -------------------------------------------------------------------------

    const avatarAssetPublicId =
      command.avatarAssetPublicId === null
        ? undefined
        : new AvatarAssetPublicId(command.avatarAssetPublicId);

    // -------------------------------------------------------------------------
    // Delegate the state mutation to the aggregate.
    // -------------------------------------------------------------------------

    aggregate.setAvatar(
      avatarAssetPublicId,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // Persist the updated Traveller Profile aggregate.
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);
  }
}
