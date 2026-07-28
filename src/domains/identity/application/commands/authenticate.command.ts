// src/domains/identity/application/commands/authenticate.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

import type { IdentityId } from '../../domain/value-objects/identity-id.vo';

export class AuthenticateCommand extends Command {
  public constructor(
    public readonly identityId: IdentityId,
    public readonly authenticatedAt: Date,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
