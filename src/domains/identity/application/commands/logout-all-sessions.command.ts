// src/domains/identity/application/commands/logout-all-sessions.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

import type { IdentityId } from '../../domain/value-objects/identity-id.vo';

export class LogoutAllSessionsCommand extends Command {
  constructor(
    public readonly identityId: IdentityId,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
