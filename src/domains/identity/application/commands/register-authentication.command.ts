// src/domains/identity/application/commands/register-authentication.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

import type { IdentityId } from '../../domain/value-objects/identity-id.vo';

export class RegisterAuthenticationCommand extends Command {
  public constructor(
    public readonly identityId: IdentityId,
    public readonly passwordHash: string,
    public readonly correlationId: string,
    public readonly passwordExpiresAt?: Date,
    public readonly causationId?: string,
  ) {
    super();
  }
}
