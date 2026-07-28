// src/domains/authorization/application/commands/remove-permission-from-role.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class RemovePermissionFromRoleCommand extends Command {
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
