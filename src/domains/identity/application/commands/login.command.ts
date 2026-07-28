// src/domains/identity/application/commands/login.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class LoginCommand extends Command {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly correlationId: string,
  ) {
    super();
  }
}
