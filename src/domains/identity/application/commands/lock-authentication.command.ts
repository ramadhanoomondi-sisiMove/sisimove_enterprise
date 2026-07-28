// src/domains/identity/application/commands/lock-authentication.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

import type { IdentityId } from '../../domain/value-objects/identity-id.vo';
import type { AuthenticationFailureReason } from '../../domain/value-objects/authentication-failure-reason.enum';

export class LockAuthenticationCommand extends Command {
  public constructor(
    public readonly identityId: IdentityId,
    public readonly lockedUntil: Date,
    public readonly reason: AuthenticationFailureReason,
    public readonly lockedAt: Date,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
