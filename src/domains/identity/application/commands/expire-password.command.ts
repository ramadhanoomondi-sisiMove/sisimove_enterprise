// src/domains/identity/application/commands/expire-password.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

import type { IdentityId } from '../../domain/value-objects/identity-id.vo';

export class ExpirePasswordCommand extends Command {
  public constructor(
    public readonly identityId: IdentityId,
    public readonly expiredAt: Date,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
