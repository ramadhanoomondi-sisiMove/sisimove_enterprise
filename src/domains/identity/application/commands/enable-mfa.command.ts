// src/domains/identity/application/commands/enable-mfa.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

import type { IdentityId } from '../../domain/value-objects/identity-id.vo';
import type { AuthenticationMfaMethod } from '../../domain/value-objects/authentication-mfa-method.enum';

export class EnableMfaCommand extends Command {
  public constructor(
    public readonly identityId: IdentityId,
    public readonly method: AuthenticationMfaMethod,
    public readonly encryptedSecret: string,
    public readonly enabledAt: Date,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
