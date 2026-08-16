// src/domains/trust/application/commands/trust-profile/create-trust-profile.command.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { TrustProfileStatus } from '../../../domain/value-objects/trust-profile-status.vo';
import { TrustVerificationLevel } from '../../../domain/value-objects/trust-verification-level.vo';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class CreateTrustProfileCommand extends Command {
  constructor(
    /**
     * Identity.publicId of the member who owns this Trust Profile.
     */
    public readonly memberPublicId: string,

    /**
     * Initial Trust Profile status.
     */
    public readonly status: TrustProfileStatus = TrustProfileStatus.ACTIVE,

    /**
     * Initial verification level.
     */
    public readonly verificationLevel: TrustVerificationLevel = TrustVerificationLevel.NONE,

    /**
     * Correlation identifier for distributed tracing.
     */
    public readonly correlationId: string,

    /**
     * Causation identifier for distributed tracing.
     */
    public readonly causationId?: string,
  ) {
    super();
  }
}
