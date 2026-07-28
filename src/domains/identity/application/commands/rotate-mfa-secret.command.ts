// src/domains/identity/application/commands/rotate-mfa-secret.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

import type { IdentityId } from '../../domain/value-objects/identity-id.vo';

export class RotateMfaSecretCommand extends Command {
  public constructor(
    public readonly identityId: IdentityId,
    public readonly encryptedSecret: string,
    public readonly rotatedAt: Date,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
