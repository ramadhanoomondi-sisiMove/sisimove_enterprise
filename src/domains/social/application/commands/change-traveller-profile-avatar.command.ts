// -----------------------------------------------------------------------------
// sisiMove — Change Traveller Profile Avatar Command
// -----------------------------------------------------------------------------
//
// Application command for changing a Traveller Profile avatar.
//
// Authorization boundary:
//
// - HTTP authentication is performed by JwtAuthGuard.
// - The controller supplies the authenticated Identity public ID.
// - The application handler uses that identity to verify ownership.
// - No traveller-profile RBAC permission is required for self-service avatar
//   changes.
//
// Identifier semantics:
//
// - travellerProfileId is the Traveller Profile PUBLIC identifier.
// - avatarAssetPublicId is the Asset PUBLIC identifier.
// - identityPublicId identifies the authenticated caller.
//
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

export class ChangeTravellerProfileAvatarCommand extends Command {
  constructor(
    /**
     * Traveller Profile PUBLIC identifier.
     *
     * Example:
     *
     *     TPR-PKXTFUK
     */
    public readonly travellerProfileId: string,

    /**
     * Asset PUBLIC identifier.
     *
     * `null` removes the current avatar.
     */
    public readonly avatarAssetPublicId: string | null,

    /**
     * Correlation identifier for tracing the operation.
     */
    public readonly correlationId: string,

    /**
     * Authenticated Identity PUBLIC identifier.
     *
     * This is supplied by CurrentIdentity in the HTTP controller.
     */
    public readonly identityPublicId: string,

    /**
     * Optional causation identifier.
     */
    public readonly causationId?: string,
  ) {
    super();
  }
}
