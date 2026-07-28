// src/domains/authorization/application/commands/assign-permission.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class AssignPermissionCommand extends Command {
  constructor(
    public readonly roleId: string,
    public readonly permissionId: string,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
