// src/domains/identity/application/commands/disable-mfa.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

import type { IdentityId } from '../../domain/value-objects/identity-id.vo';

export class DisableMfaCommand extends Command {
  public constructor(
    public readonly identityId: IdentityId,
    public readonly disabledAt: Date,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
