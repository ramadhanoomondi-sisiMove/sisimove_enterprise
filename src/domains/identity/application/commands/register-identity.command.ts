// src/domains/identity/application/commands/register-identity.command.ts

import { Command } from '../../../../foundation/kernel/application/command';
import type { IdentityType } from '../../domain/value-objects/identity-type.enum';

export class RegisterIdentityCommand extends Command {
  constructor(
    public readonly type: IdentityType,
    public readonly email: string,
    public readonly phoneNumber: string | undefined,
    public readonly password: string,
    public readonly correlationId: string,
  ) {
    super();
  }
}
