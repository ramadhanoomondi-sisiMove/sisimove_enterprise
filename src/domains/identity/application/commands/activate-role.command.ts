// src/domains/authorization/application/commands/activate-role.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class ActivateRoleCommand extends Command {
  constructor(
    public readonly roleId: string,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
