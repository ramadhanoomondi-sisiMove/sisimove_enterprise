// src/domains/identity/application/commands/revoke-role.command.ts

export class RevokeRoleCommand {
  constructor(
    public readonly identityPublicId: string,
    public readonly roleCode: string,
    public readonly revokedByPublicId: string,
    public readonly correlationId: string,
  ) {}
}
