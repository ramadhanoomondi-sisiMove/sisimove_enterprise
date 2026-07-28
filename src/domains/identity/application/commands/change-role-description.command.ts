// src/domains/authorization/application/commands/change-role-description.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class ChangeRoleDescriptionCommand extends Command {
  constructor(
    public readonly roleId: string,
    public readonly description: string | undefined,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
