// src/domains/identity/application/commands/change-password.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

import type { IdentityId } from '../../domain/value-objects/identity-id.vo';

export class ChangePasswordCommand extends Command {
  public constructor(
    /**
     * Identity owning the authentication.
     */
    public readonly identityId: IdentityId,

    /**
     * User's current plaintext password.
     */
    public readonly currentPassword: string,

    /**
     * User's new plaintext password.
     */
    public readonly newPassword: string,

    /**
     * When the password was changed.
     */
    public readonly changedAt: Date,

    /**
     * Correlation identifier propagated across the request.
     */
    public readonly correlationId: string,

    /**
     * Optional password expiration timestamp.
     */
    public readonly passwordExpiresAt?: Date,

    /**
     * Optional causation identifier.
     */
    public readonly causationId?: string,
  ) {
    super();
  }
}
