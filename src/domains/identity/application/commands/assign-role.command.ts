// src/domains/identity/application/commands/assign-role.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class AssignRoleCommand extends Command {
  constructor(
    public readonly identityPublicId: string,
    public readonly roleCode: string,
    public readonly assignedByPublicId: string | undefined,
    public readonly correlationId: string,
  ) {
    super();
  }
}
