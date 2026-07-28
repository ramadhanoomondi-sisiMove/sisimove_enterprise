// src/domains/authorization/application/commands/create-role.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class CreateRoleCommand extends Command {
  constructor(
    public readonly name: string,
    public readonly code: string,
    public readonly description: string | undefined,
    public readonly displayOrder: number,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
