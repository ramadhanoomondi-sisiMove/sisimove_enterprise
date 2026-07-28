// src/domains/authorization/application/commands/assign-permission-to-role.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class AssignPermissionToRoleCommand extends Command {
  constructor(
    public readonly rolePublicId: string,
    public readonly permissionPublicId: string,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();

    Object.freeze(this);
  }
}
