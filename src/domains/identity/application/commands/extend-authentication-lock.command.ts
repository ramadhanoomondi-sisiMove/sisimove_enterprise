// src/domains/identity/application/commands/extend-authentication-lock.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

import type { IdentityId } from '../../domain/value-objects/identity-id.vo';

export class ExtendAuthenticationLockCommand extends Command {
  public constructor(
    public readonly identityId: IdentityId,
    public readonly lockedUntil: Date,
    public readonly extendedAt: Date,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
