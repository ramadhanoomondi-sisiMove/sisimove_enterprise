// src/domains/identity/application/commands/logout.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class LogoutCommand extends Command {
  constructor(
    public readonly refreshToken: string,
    public readonly correlationId: string,
  ) {
    super();
  }
}
