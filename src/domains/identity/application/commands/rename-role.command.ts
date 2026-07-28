// src/domains/authorization/application/commands/rename-role.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class RenameRoleCommand extends Command {
  constructor(
    public readonly roleId: string,
    public readonly name: string,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();

    Object.freeze(this);
  }
}
