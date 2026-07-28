// src/domains/authorization/application/commands/remove-permission.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class RemovePermissionCommand extends Command {
  constructor(
    public readonly roleId: string,
    public readonly permissionId: string,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
