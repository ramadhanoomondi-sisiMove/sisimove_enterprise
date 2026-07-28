// src/domains/identity/application/commands/refresh-token.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class RefreshTokenCommand extends Command {
  constructor(
    public readonly refreshToken: string,
    public readonly correlationId: string,
  ) {
    super();
  }
}
