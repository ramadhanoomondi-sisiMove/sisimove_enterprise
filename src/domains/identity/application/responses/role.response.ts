import type { RolePermissionResponse } from './role-permission.response';

export class RoleResponse {
  constructor(
    public readonly id: string,
    public readonly publicId: string,

    public readonly name: string,
    public readonly code: string,

    public readonly description: string | undefined,
    public readonly displayOrder: number,

    public readonly isSystem: boolean,
    public readonly isActive: boolean,

    public readonly createdAt: Date,
    public readonly updatedAt: Date,

    public readonly permissions: readonly RolePermissionResponse[],
  ) {
    Object.freeze(this);
  }
}
