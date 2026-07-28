// src/domains/identity/application/commands/revoke-permission-from-role.command.ts

export class RevokePermissionFromRoleCommand {
  constructor(
    public readonly roleCode: string,
    public readonly permissionCode: string,
    public readonly revokedByPublicId: string,
    public readonly correlationId: string,
  ) {}
}
