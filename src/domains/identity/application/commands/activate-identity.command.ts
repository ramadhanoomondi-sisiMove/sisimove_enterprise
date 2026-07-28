// src/domains/identity/application/commands/activate-identity.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class ActivateIdentityCommand extends Command {
  constructor(
    public readonly publicId: string,
    public readonly correlationId: string,
  ) {
    super();
  }
}
