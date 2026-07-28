import type { Permission, Role, RolePermission } from '@prisma/client';

import { RolePermissionResponse } from '../../../application/responses/role-permission.response';
import { RoleResponse } from '../../../application/responses/role.response';

type RoleWithPermissions = Role & {
  rolePermissions: Array<
    RolePermission & {
      permission: Permission;
    }
  >;
};

export class RoleResponseMapper {
  static toResponse(role: RoleWithPermissions): RoleResponse {
    return new RoleResponse(
      role.id,
      role.publicId,

      role.name,
      role.code,

      role.description ?? undefined,
      role.displayOrder,

      role.isSystem,
      role.isActive,

      role.createdAt,
      role.updatedAt,

      role.rolePermissions.map(
        (rolePermission) =>
          new RolePermissionResponse(
            rolePermission.permission.id,
            rolePermission.permission.publicId,

            rolePermission.permission.name,
            rolePermission.permission.code,

            rolePermission.permission.resource,
            rolePermission.permission.action,

            rolePermission.permission.description ?? undefined,

            rolePermission.permission.isSystem,
            rolePermission.permission.isActive,

            rolePermission.createdAt,
          ),
      ),
    );
  }

  static toResponses(roles: readonly RoleWithPermissions[]): RoleResponse[] {
    return roles.map((role) => this.toResponse(role));
  }
}
