// src/domains/identity/application/commands/unlock-authentication.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

import type { IdentityId } from '../../domain/value-objects/identity-id.vo';

export class UnlockAuthenticationCommand extends Command {
  public constructor(
    public readonly identityId: IdentityId,
    public readonly unlockedAt: Date,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
