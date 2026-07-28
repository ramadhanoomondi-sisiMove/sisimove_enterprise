// src/domains/authorization/domain/repositories/role-permission.repository.ts

import type { RolePermissionEntity } from '../entities/role-permission.entity';

import type { PermissionId } from '../value-objects/permission-id.vo';
import type { RoleId } from '../value-objects/role-id.vo';

export interface RolePermissionRepository {
  create(rolePermission: RolePermissionEntity): Promise<void>;

  delete(roleId: RoleId, permissionId: PermissionId): Promise<void>;

  findByRoleAndPermission(
    roleId: RoleId,
    permissionId: PermissionId,
  ): Promise<RolePermissionEntity | null>;

  findByRole(roleId: RoleId): Promise<readonly RolePermissionEntity[]>;

  findByPermission(
    permissionId: PermissionId,
  ): Promise<readonly RolePermissionEntity[]>;

  exists(roleId: RoleId, permissionId: PermissionId): Promise<boolean>;
}
