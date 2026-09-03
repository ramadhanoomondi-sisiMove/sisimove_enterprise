// -----------------------------------------------------------------------------
// Authentication — Change Password Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  AuthenticationPasswordChangedAt,
  AuthenticationPasswordHash,
  AuthenticationPublicId,
} from '../../domain/value-objects';

// =============================================================================
// Command
// =============================================================================

/**
 * Application command for changing an Authentication password.
 *
 * Plaintext passwords are never passed into the domain.
 * The password must already be hashed by PasswordHasher infrastructure.
 *
 * Password version is intentionally not supplied by the caller.
 * The handler derives it from the current aggregate version.
 */
export class ChangePasswordCommand extends Command {
  public constructor(
    /**
     * Public identifier of the Authentication aggregate.
     */
    public readonly authenticationPublicId: AuthenticationPublicId,

    /**
     * Already-hashed password.
     *
     * Plaintext passwords must never enter the domain command.
     */
    public readonly passwordHash: AuthenticationPasswordHash,

    /**
     * Timestamp at which the password change becomes effective.
     */
    public readonly changedAt: AuthenticationPasswordChangedAt,

    /**
     * Correlation identifier for the password-change operation.
     */
    public readonly correlationId: string,

    /**
     * Optional causation identifier.
     */
    public readonly causationId?: string,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ChangePasswordCommand;
