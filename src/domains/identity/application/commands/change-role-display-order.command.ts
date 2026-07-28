// src/domains/authorization/application/commands/change-role-display-order.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class ChangeRoleDisplayOrderCommand extends Command {
  constructor(
    public readonly roleId: string,
    public readonly displayOrder: number,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
