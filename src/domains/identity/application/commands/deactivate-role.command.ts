// src/domains/authorization/application/commands/deactivate-role.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class DeactivateRoleCommand extends Command {
  constructor(
    public readonly roleId: string,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
