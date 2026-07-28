export class RolePermissionResponse {
  constructor(
    public readonly permissionId: string,
    public readonly permissionPublicId: string,

    public readonly name: string,
    public readonly code: string,

    public readonly resource: string,
    public readonly action: string,

    public readonly description: string | undefined,

    public readonly isSystem: boolean,
    public readonly isActive: boolean,

    public readonly assignedAt: Date,
  ) {
    Object.freeze(this);
  }
}
